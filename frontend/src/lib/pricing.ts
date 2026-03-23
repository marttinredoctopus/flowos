export const PRICING = {
  free: {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    storage_gb: 1,
    max_file_mb: 10,
    limits: {
      clients: 5,
      team_members: 3,
      projects: 3,
      ai_requests: 0,
    },
    features: [
      '5 clients',
      '3 team members',
      '3 projects',
      'Basic Kanban view',
      '1 GB storage',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    price: { monthly: 29, annual: 24 },
    storage_gb: 20,
    max_file_mb: 100,
    limits: {
      clients: -1,
      team_members: 15,
      projects: -1,
      ai_requests: 100,
    },
    features: [
      'Unlimited clients',
      'Up to 15 team members',
      'All views (Kanban, List, Calendar, Timeline)',
      'Content Calendar',
      'Time Tracking & Invoices',
      'Client Portal',
      '100 AI requests/month',
      '20 GB storage',
      'Priority support',
    ],
  },
  agency: {
    name: 'Agency',
    price: { monthly: 59, annual: 49 },
    storage_gb: 100,
    max_file_mb: 500,
    limits: {
      clients: -1,
      team_members: -1,
      projects: -1,
      ai_requests: -1,
    },
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Unlimited AI requests',
      'White-label branding',
      'Public API + Webhooks',
      '100 GB storage',
      'Dedicated account manager',
    ],
  },
} as const;

export type PlanKey = keyof typeof PRICING;
