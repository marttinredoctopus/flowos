'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const SERVICES = ['Social Media', 'Paid Ads', 'SEO', 'Video Production', 'Branding', 'Web Development', 'PR & Comms', 'Strategy'];
const TEAM_SIZES = ['Just me', '2–5', '6–15', '16–50', '50+'];
const GOALS = ['Manage client projects', 'Track team tasks', 'Create invoices', 'Schedule content', 'Track time & billing', 'Manage ad campaigns'];

const STEPS = [
  { id: 1, title: 'Welcome to TasksDone', subtitle: "Let's set up your workspace" },
  { id: 2, title: 'Your Agency', subtitle: 'Tell us about your business' },
  { id: 3, title: 'Team Size', subtitle: 'How big is your team?' },
  { id: 4, title: 'Your Goals', subtitle: 'What do you want to accomplish?' },
  { id: 5, title: "You're all set!", subtitle: 'Your workspace is ready' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    orgName: '',
    services: [] as string[],
    teamSize: '',
    goals: [] as string[],
  });

  function toggleService(s: string) {
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }));
  }

  function toggleGoal(g: string) {
    setForm(f => ({ ...f, goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g] }));
  }

  async function finish() {
    setSaving(true);
    try {
      await apiClient.patch('/org/onboarding', {
        services: form.services,
        teamSize: form.teamSize,
        goals: form.goals,
        onboardingCompleted: true,
      });
      router.replace('/dashboard');
    } catch {
      toast.error('Failed to save. Continuing anyway...');
      router.replace('/dashboard');
    } finally { setSaving(false); }
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#06080f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#7c6fe0,#4a9eff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TasksDone
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: '#21262d', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(135deg,#7c6fe0,#4a9eff)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>

        {/* Step indicator */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#6e7681' }}>Step {step} of {STEPS.length}</span>
        </div>

        {/* Card */}
        <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 20, padding: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 8 }}>{STEPS[step - 1].title}</h1>
          <p style={{ fontSize: 14, color: '#8b949e', textAlign: 'center', marginBottom: 32 }}>{STEPS[step - 1].subtitle}</p>

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>👋</div>
              <p style={{ fontSize: 16, color: '#f0f6fc', marginBottom: 8 }}>
                Hey {user?.name?.split(' ')[0] || 'there'}!
              </p>
              <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.6, marginBottom: 32 }}>
                TasksDone helps agencies manage clients, projects, tasks, invoices, and content — all in one place. Let's get you set up in 2 minutes.
              </p>
              <button onClick={() => setStep(2)} style={btnStyle}>
                Get Started →
              </button>
            </div>
          )}

          {/* Step 2 — Agency */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Agency / Company Name</label>
                <input
                  value={form.orgName}
                  onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))}
                  placeholder="e.g. Creative Studio Co."
                  autoFocus
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Services you offer (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SERVICES.map(s => (
                    <button key={s} onClick={() => toggleService(s)} style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                      background: form.services.includes(s) ? 'linear-gradient(135deg,#7c6fe0,#4a9eff)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${form.services.includes(s) ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                      color: form.services.includes(s) ? '#fff' : '#8b949e',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={ghostBtnStyle}>Back</button>
                <button onClick={() => setStep(3)} style={{ ...btnStyle, flex: 1 }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Team size */}
          {step === 3 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 32 }}>
                {TEAM_SIZES.map(size => (
                  <button key={size} onClick={() => setForm(f => ({ ...f, teamSize: size }))} style={{
                    padding: '16px 12px', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
                    background: form.teamSize === size ? 'linear-gradient(135deg,rgba(124,111,224,0.2),rgba(74,158,255,0.2))' : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${form.teamSize === size ? '#7c6fe0' : 'rgba(255,255,255,0.08)'}`,
                    color: form.teamSize === size ? '#fff' : '#8b949e',
                  }}>{size}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} style={ghostBtnStyle}>Back</button>
                <button onClick={() => setStep(4)} disabled={!form.teamSize} style={{ ...btnStyle, flex: 1, opacity: form.teamSize ? 1 : 0.5 }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4 — Goals */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                {GOALS.map(g => (
                  <button key={g} onClick={() => toggleGoal(g)} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 10, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                    background: form.goals.includes(g) ? 'rgba(124,111,224,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.goals.includes(g) ? '#7c6fe0' : 'rgba(255,255,255,0.08)'}`,
                    color: form.goals.includes(g) ? '#fff' : '#8b949e',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      background: form.goals.includes(g) ? '#7c6fe0' : 'transparent',
                      border: `2px solid ${form.goals.includes(g) ? '#7c6fe0' : 'rgba(255,255,255,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: '#fff',
                    }}>{form.goals.includes(g) ? '✓' : ''}</div>
                    {g}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(3)} style={ghostBtnStyle}>Back</button>
                <button onClick={() => setStep(5)} disabled={form.goals.length === 0} style={{ ...btnStyle, flex: 1, opacity: form.goals.length > 0 ? 1 : 0.5 }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 5 — Done */}
          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
              <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.7, marginBottom: 32 }}>
                Your TasksDone workspace is ready. Start by adding your first client or project, or invite your team.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
                <p style={{ fontSize: 12, color: '#6e7681', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested first steps</p>
                {[
                  '➕ Add your first client',
                  '📁 Create a project',
                  '✅ Add your first task',
                  '👥 Invite your team',
                ].map((item, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#8b949e', padding: '6px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>{item}</div>
                ))}
              </div>
              <button onClick={finish} disabled={saving} style={btnStyle}>
                {saving ? 'Setting up...' : 'Enter TasksDone →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: 'inline-block', width: '100%', padding: '12px 24px', borderRadius: 10,
  background: 'linear-gradient(135deg,#7c6fe0,#4a9eff)', color: '#fff',
  fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
  transition: 'opacity 0.15s',
};

const ghostBtnStyle: React.CSSProperties = {
  padding: '12px 20px', borderRadius: 10, background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)', color: '#8b949e',
  fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 10,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 10,
};
