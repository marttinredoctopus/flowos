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
