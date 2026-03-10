#!/bin/bash
set -e
echo "================================================================"
echo "   FlowOS — Automated Server Setup"
echo "   Email: mahmoud.redoctopus@gmail.com"
echo "================================================================"

# ── CONFIGURATION ────────────────────────────────────────────────────
read -p "Enter your DOMAIN (e.g. myagency.com): " DOMAIN
read -p "Enter your GMAIL APP PASSWORD (16 chars, from Google account): " GMAIL_PASS
DB_PASS="Martin@@@88662244aa"
ADMIN_EMAIL="mahmoud.redoctopus@gmail.com"
APP_DIR="/var/www/flowos"
GITHUB_URL="https://github.com/marttinredoctopus/flowos.git"

echo ""
echo "Domain: $DOMAIN"
echo "App dir: $APP_DIR"
echo ""

# ── STEP 1: System Update ────────────────────────────────────────────
echo "[1/14] Updating system..."
apt-get update -qq && apt-get upgrade -y -qq

# ── STEP 2: Node.js 20 ───────────────────────────────────────────────
echo "[2/14] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# ── STEP 3: PM2 ──────────────────────────────────────────────────────
echo "[3/14] Installing PM2..."
npm install -g pm2

# ── STEP 4: PostgreSQL 16 ────────────────────────────────────────────
echo "[4/14] Installing PostgreSQL 16..."
sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt-get update -qq
apt-get install -y postgresql-16

systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql -c "CREATE DATABASE flowos;" 2>/dev/null || echo "DB already exists"
sudo -u postgres psql -c "CREATE USER flowos_user WITH ENCRYPTED PASSWORD '$DB_PASS';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE flowos TO flowos_user;"
sudo -u postgres psql -d flowos -c "GRANT ALL ON SCHEMA public TO flowos_user;"

# ── STEP 5: Redis 7 ───────────────────────────────────────────────────
echo "[5/14] Installing Redis 7..."
apt-get install -y redis-server
sed -i 's/^# bind 127.0.0.1/bind 127.0.0.1/' /etc/redis/redis.conf
sed -i 's/^bind .*/bind 127.0.0.1/' /etc/redis/redis.conf
systemctl restart redis-server
systemctl enable redis-server

# ── STEP 6: Nginx ────────────────────────────────────────────────────
echo "[6/14] Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# ── STEP 7: Clone repo ───────────────────────────────────────────────
echo "[7/14] Cloning repository..."
mkdir -p $APP_DIR
if [ -d "$APP_DIR/.git" ]; then
  cd $APP_DIR && git pull
else
  git clone $GITHUB_URL $APP_DIR
fi

# ── STEP 8: Generate secrets ─────────────────────────────────────────
echo "[8/14] Generating secrets..."
JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)

# Install web-push globally to generate VAPID keys
npm install -g web-push 2>/dev/null || true
VAPID_KEYS=$(web-push generate-vapid-keys --json 2>/dev/null || npx web-push generate-vapid-keys --json)
VAPID_PUBLIC=$(echo $VAPID_KEYS | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['publicKey'])" 2>/dev/null || echo "GENERATE_MANUALLY")
VAPID_PRIVATE=$(echo $VAPID_KEYS | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['privateKey'])" 2>/dev/null || echo "GENERATE_MANUALLY")

# ── STEP 9: Write .env files ─────────────────────────────────────────
echo "[9/14] Writing environment files..."

cat > $APP_DIR/backend/.env << EOF
DATABASE_URL=postgresql://flowos_user:${DB_PASS}@localhost:5432/flowos
REDIS_URL=redis://localhost:6379
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://${DOMAIN}
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=${ADMIN_EMAIL}
SMTP_PASS=${GMAIL_PASS}
EMAIL_FROM=noreply@${DOMAIN}
EMAIL_FROM_NAME=FlowOS
VAPID_PUBLIC_KEY=${VAPID_PUBLIC}
VAPID_PRIVATE_KEY=${VAPID_PRIVATE}
VAPID_EMAIL=${ADMIN_EMAIL}
UPLOAD_DIR=uploads
EOF

cat > $APP_DIR/frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://api.${DOMAIN}/api
NEXT_PUBLIC_SOCKET_URL=https://api.${DOMAIN}
NEXT_PUBLIC_VAPID_KEY=${VAPID_PUBLIC}
NEXT_PUBLIC_APP_URL=https://${DOMAIN}
NEXT_PUBLIC_APP_NAME=FlowOS
EOF

# ── STEP 10: npm install + build ─────────────────────────────────────
echo "[10/14] Installing dependencies and building..."
cd $APP_DIR/backend && npm install && npm run build
cd $APP_DIR/frontend && npm install && npm run build

# ── STEP 11: DB migrate + seed ───────────────────────────────────────
echo "[11/14] Running migrations and seeds..."
cd $APP_DIR/backend
npm run db:migrate
npm run db:seed

# ── STEP 12: Nginx config ────────────────────────────────────────────
echo "[12/14] Configuring Nginx..."

cat > /etc/nginx/sites-available/flowos << NGINX
# Rate limiting zones
limit_req_zone \$binary_remote_addr zone=api:10m rate=30r/m;
limit_req_zone \$binary_remote_addr zone=general:10m rate=60r/m;

# Frontend — https://DOMAIN
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://\$host\$request_uri;
}
server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    gzip on; gzip_types text/html application/javascript text/css application/json;

    location / {
        limit_req zone=general burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

# API + Socket.io — https://api.DOMAIN
server {
    listen 80;
    server_name api.${DOMAIN};
    return 301 https://\$host\$request_uri;
}
server {
    listen 443 ssl http2;
    server_name api.${DOMAIN};
    ssl_certificate /etc/letsencrypt/live/api.${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Socket.io
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_read_timeout 86400;
    }

    location / {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/flowos /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── STEP 13: SSL with Certbot ─────────────────────────────────────────
echo "[13/14] Installing SSL certificates..."
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -d api.${DOMAIN} \
  --non-interactive --agree-tos --email ${ADMIN_EMAIL} || {
  echo "⚠️  SSL failed — check DNS is pointing to this server's IP"
  echo "   Retry with: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -d api.${DOMAIN}"
}

# ── STEP 14: PM2 + UFW + Fail2ban ────────────────────────────────────
echo "[14/14] Starting services..."

cat > $APP_DIR/ecosystem.config.js << 'PM2'
module.exports = {
  apps: [
    {
      name: 'flowos-backend',
      cwd: '/var/www/flowos/backend',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3001 },
      error_file: '/var/log/flowos/backend-error.log',
      out_file: '/var/log/flowos/backend-out.log',
      merge_logs: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: 'flowos-frontend',
      cwd: '/var/www/flowos/frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      env: { NODE_ENV: 'production' },
      error_file: '/var/log/flowos/frontend-error.log',
      out_file: '/var/log/flowos/frontend-out.log',
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
PM2

mkdir -p /var/log/flowos
cd $APP_DIR && pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | bash || true

# UFW
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# Fail2ban
apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# ── Save credentials ──────────────────────────────────────────────────
cat > /root/flowos-credentials.txt << CREDS
=== FlowOS Credentials ===
Domain:    https://${DOMAIN}
API:       https://api.${DOMAIN}

Admin Login:
  Email:    admin@flowos.io
  Password: Admin123!

Database:
  Host:     localhost
  DB:       flowos
  User:     flowos_user
  Pass:     ${DB_PASS}

JWT Secret:         ${JWT_SECRET}
JWT Refresh Secret: ${JWT_REFRESH_SECRET}
VAPID Public:       ${VAPID_PUBLIC}
VAPID Private:      ${VAPID_PRIVATE}

Generated: $(date)
CREDS
chmod 600 /root/flowos-credentials.txt

echo ""
echo "================================================================"
echo "  ✅  FlowOS is LIVE!"
echo "================================================================"
echo "  Site:   https://${DOMAIN}"
echo "  Login:  admin@flowos.io / Admin123!"
echo "  Creds:  cat /root/flowos-credentials.txt"
echo "================================================================"
