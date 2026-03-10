'use client';

import { useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';

const FEATURES = [
  { icon: '✅', title: 'Task Management', desc: 'Kanban boards, priorities, deadlines, and subtasks — all in one place.' },
  { icon: '📅', title: 'Content Calendar', desc: 'Plan and schedule posts for Instagram, TikTok, LinkedIn, and more.' },
  { icon: '📢', title: 'Ad Campaign Tracker', desc: 'Monitor ad spend, performance, and ROAS across all platforms.' },
  { icon: '💬', title: 'Internal Chat', desc: 'Real-time team messaging with file sharing and @mentions.' },
  { icon: '⏱️', title: 'Time Tracking', desc: 'One-click timer, billable hours, and automatic time reports.' },
  { icon: '⚡', title: 'Automation Engine', desc: 'Trigger actions based on events — no code required.' },
  { icon: '📁', title: 'File Manager', desc: 'Organised file storage linked to clients, projects, and tasks.' },
  { icon: '🏢', title: 'Client Portal', desc: 'Give clients a branded portal to approve deliverables and track progress.' },
  { icon: '✍️', title: 'Approval Workflow', desc: 'Structured review and approval for content, creatives, and reports.' },
];

const STEPS = [
  { num: '01', title: 'Create workspace', desc: 'Set up your agency workspace in 60 seconds. No credit card required.' },
  { num: '02', title: 'Add clients & team', desc: 'Invite your team, onboard clients, and assign roles instantly.' },
  { num: '03', title: 'Run projects', desc: 'Create projects, assign tasks, track time, and manage content calendars.' },
  { num: '04', title: 'Ship faster', desc: 'Use automations and approvals to deliver work 3× faster than before.' },
];

const PLANS = [
  { name: 'Starter', price: '$0', period: '/mo', features: ['3 projects', '5 team members', 'Basic task management', 'Content calendar', '5GB storage'], popular: false },
  { name: 'Pro', price: '$49', period: '/mo', features: ['Unlimited projects', '25 team members', 'All 9 tools', 'Client portal', 'Automations', '100GB storage', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$149', period: '/mo', features: ['Unlimited everything', 'Custom domain', 'SSO / SAML', 'Dedicated CSM', 'SLA guarantee', 'API access', 'White-label'], popular: false },
];

const TESTIMONIALS = [
  { name: 'Lena Hoffmann', agency: 'Bright Side Digital, Berlin', text: 'We replaced Trello, Notion, Harvest, and Slack all at once. FlowOS saved us $800/month and 10 hours a week. Nothing comes close.' },
  { name: 'Marcus Adeyemi', agency: 'Pulse Creative, Lagos', text: 'The client portal is a game-changer. Our clients love having visibility into their projects and the approval workflow cut revision rounds in half.' },
  { name: 'Sofia Reyes', agency: 'Norte Agency, Mexico City', text: 'We onboarded 3 new clients in one week with FlowOS. The content calendar alone is worth the price. I\'d give it 10 stars if I could.' },
];

const REPLACES = ['Trello', 'ClickUp', 'Notion', 'Asana', 'Slack', 'Google Drive', 'Monday.com', 'Harvest'];

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-xl gradient-text">FlowOS</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-white/10 rounded-lg transition-all hover:border-white/20"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="px-4 py-2 text-sm font-semibold gradient-bg rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 grid-pattern overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-brand-purple/10 blur-[120px]" />
        </div>
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-brand-blue text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            2,400+ agencies already running on FlowOS
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            The platform that{' '}
            <span className="gradient-text">replaces every tool</span>{' '}
            your agency uses
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tasks, content calendar, ad campaigns, time tracking, client portal, and team chat — unified in one beautifully designed workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSignup(true)}
              className="px-8 py-4 gradient-bg rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/25"
            >
              Start for free — no card needed
            </button>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl font-semibold text-lg border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all"
            >
              See all features →
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-dark-800">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2,400+', label: 'Agencies worldwide' },
            { value: '6 tools', label: 'Replaced on average' },
            { value: '98%', label: 'Customer satisfaction' },
            { value: '4.9★', label: 'Average rating' },
          ].map((s) => (
            <div key={s.value}>
              <div className="font-display text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Replaces ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-6">Replaces all of these</p>
          <div className="flex flex-wrap justify-center gap-3">
            {REPLACES.map((tool) => (
              <span key={tool} className="px-4 py-2 rounded-full bg-dark-700 border border-white/10 text-slate-300 text-sm line-through decoration-red-400/70">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything your agency needs
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Nine powerful tools, one subscription, zero switching costs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-dark-800 border border-white/5 hover:border-brand-purple/30 transition-all group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-lg mb-2 group-hover:gradient-text transition-all">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-dark-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-slate-400 text-lg">Up and running in under 5 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center font-display font-bold text-lg mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Simple, honest pricing</h2>
            <p className="text-slate-400 text-lg">No hidden fees. Cancel any time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-8 border transition-all ${
                  p.popular
                    ? 'bg-dark-700 border-brand-purple/50 relative shadow-xl shadow-brand-purple/20'
                    : 'bg-dark-800 border-white/5'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display font-bold text-xl mb-2">{p.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="font-display font-extrabold text-4xl gradient-text">{p.price}</span>
                  <span className="text-slate-400 mb-1">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="text-brand-blue">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowSignup(true)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    p.popular
                      ? 'gradient-bg hover:opacity-90'
                      : 'border border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Loved by agency owners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-8 rounded-2xl bg-dark-700 border border-white/5">
                <div className="text-brand-blue text-2xl mb-4">❝</div>
                <p className="text-slate-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-slate-400 text-sm">{t.agency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-6">
            Ready to run your agency{' '}
            <span className="gradient-text">smarter?</span>
          </h2>
          <p className="text-slate-400 text-xl mb-10">
            Join 2,400+ agencies already using FlowOS. Free forever on Starter.
          </p>
          <button
            onClick={() => setShowSignup(true)}
            className="px-10 py-5 gradient-bg rounded-xl font-bold text-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/25"
          >
            Start for free today
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6 bg-dark-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-display font-bold text-xl gradient-text mb-1">FlowOS</div>
            <div className="text-slate-400 text-sm">The agency management platform.</div>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div className="text-slate-500 text-sm">© 2025 FlowOS. All rights reserved.</div>
        </div>
      </footer>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
        />
      )}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
}
