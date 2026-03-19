'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useOnboarding } from '@/context/onboardingContext';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import {
  ArrowRight, ArrowLeft, Zap, Users, Sparkles,
  Rocket, CheckCircle2, Copy, Check,
} from 'lucide-react';
import Step2Agency from './steps/Step2Agency';

const TOTAL_STEPS = 7;

const card: React.CSSProperties = {
  background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20, padding: 40, width: '100%',
};
const inputSt: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 10,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f2f9', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const labelSt: React.CSSProperties = {
  display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 8, fontWeight: 500,
};
const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  width: '100%', padding: '13px 24px', borderRadius: 11,
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
  boxShadow: '0 0 24px rgba(99,102,241,0.35)', transition: 'opacity 0.15s',
};
const btnGhost: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '12px 20px', borderRadius: 10, background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)', color: '#8b949e',
  fontSize: 14, cursor: 'pointer',
};

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: '#6e7681' }}>Step {step} of {TOTAL_STEPS}</span>
        <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle, emoji }: { title: string; subtitle: string; emoji: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>{emoji}</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f2f9', marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</h1>
      <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.6, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

export default function OnboardingFlow() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { state, setStepData, nextStep, prevStep, goToStep } = useOnboarding();
  const { step, agency, client, project, task } = state;

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ idea: string; tasks: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Step 3: create client ────────────────────────────────────────────────
  async function createClient() {
    if (!client.clientName.trim()) { toast.error('Enter a client name'); return; }
    setLoading(true);
    try {
      const res = await apiClient.post('/clients', {
        name: client.clientName, industry: client.clientIndustry, notes: client.notes,
      });
      setStepData('client', { clientId: res.data?.id || res.data?.client?.id || '' });
      nextStep();
    } catch { toast.error('Could not create client — continuing'); nextStep(); }
    finally { setLoading(false); }
  }

  // ── Step 4: create project ───────────────────────────────────────────────
  async function createProject() {
    if (!project.projectName.trim()) { toast.error('Enter a project name'); return; }
    setLoading(true);
    try {
      const payload: any = { name: project.projectName, status: 'active' };
      if (client.clientId) payload.clientId = client.clientId;
      if (project.deadline) payload.dueDate = project.deadline;
      const res = await apiClient.post('/projects', payload);
      setStepData('project', { projectId: res.data?.id || res.data?.project?.id || '' });
      nextStep();
    } catch { toast.error('Could not create project — continuing'); nextStep(); }
    finally { setLoading(false); }
  }

  // ── Step 5: create task ──────────────────────────────────────────────────
  async function createTask() {
    if (!task.taskName.trim()) { toast.error('Enter a task name'); return; }
    setLoading(true);
    try {
      const payload: any = { title: task.taskName, status: 'todo', priority: 'medium' };
      if (project.projectId) payload.projectId = project.projectId;
      if (task.dueDate) payload.dueDate = task.dueDate;
      await apiClient.post('/tasks', payload);
      nextStep();
    } catch { toast.error('Could not create task — continuing'); nextStep(); }
    finally { setLoading(false); }
  }

  // ── Step 6: AI generate ──────────────────────────────────────────────────
  async function generateAI() {
    setAiLoading(true);
    try {
      const res = await apiClient.post('/intelligence/generate', {
        prompt: `Create a short marketing campaign plan for a ${client.clientIndustry || 'digital'} client called "${client.clientName || 'my client'}". Include one campaign idea and 4 actionable tasks.`,
        type: 'campaign',
      });
      const text: string = res.data?.result || res.data?.text || res.data?.content || '';
      const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean);
      const idea = lines[0] || 'Launch a 30-day social proof campaign showcasing client results.';
      const tasks = lines.slice(1, 5).length > 0
        ? lines.slice(1, 5).map((l: string) => l.replace(/^[-*•\d.]+\s*/, ''))
        : ['Write 3 case study posts', 'Set up retargeting ads', 'Create a lead magnet', 'Launch email welcome sequence'];
      setAiResult({ idea, tasks });
    } catch {
      setAiResult({
        idea: 'Launch a 30-day social proof campaign showcasing client results to drive awareness and inbound leads.',
        tasks: ['Write 3 case study posts from existing results', 'Set up retargeting ads for website visitors', 'Create a lead magnet (free audit or checklist)', 'Launch 5-email welcome sequence for new leads'],
      });
    }
    setAiLoading(false);
  }

  // ── Finish ────────────────────────────────────────────────────────────────
  async function finish() {
    setLoading(true);
    try {
      await apiClient.patch('/org/onboarding', {
        agencyName: agency.agencyName, teamSize: agency.teamSize,
        agencyType: agency.industry, onboardingCompleted: true,
      });
    } catch { /* ignore */ }
    router.replace('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06080f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.09), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#f1f2f9', letterSpacing: '-0.03em' }}>
              Tasks<span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Done</span>
            </span>
          </div>
        </div>

        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* ── STEP 1: Welcome ─────────────────────────────────────────── */}
            {step === 1 && (
              <div style={card}>
                <StepHeader emoji="👋" title={`Welcome, ${user?.name?.split(' ')[0] || 'there'}!`} subtitle="Let's get your workspace ready in 60 seconds." />
                <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
                  {['✦  Your agency profile', '✦  First client', '✦  First project', '✦  First task', '✦  AI campaign plan'].map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#8b949e', padding: '5px 0' }}>{item}</div>
                  ))}
                </div>
                <button onClick={nextStep} style={btnPrimary}>Get Started <ArrowRight size={16} /></button>
              </div>
            )}

            {/* ── STEP 2: Agency setup ─────────────────────────────────────── */}
            {step === 2 && (
              <div style={card}>
                <StepHeader emoji="🏢" title="Set up your agency" subtitle="Tell us about your business." />
                <Step2Agency />
              </div>
            )}

            {/* ── STEP 3: Create Client ────────────────────────────────────── */}
            {step === 3 && (
              <div style={card}>
                <StepHeader emoji="👤" title="Add your first client" subtitle="Create a client profile to link projects to." />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={labelSt}>Client / company name *</label>
                    <input
                      value={client.clientName}
                      onChange={e => setStepData('client', { clientName: e.target.value })}
                      placeholder="e.g. Acme Corporation"
                      autoFocus
                      style={inputSt}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#06b6d4'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div>
                    <label style={labelSt}>Industry</label>
                    <select value={client.clientIndustry} onChange={e => setStepData('client', { clientIndustry: e.target.value })} style={{ ...inputSt, appearance: 'none' as any }}>
                      <option value="">Select industry</option>
                      {['E-commerce', 'SaaS / Tech', 'Real Estate', 'Healthcare', 'Fashion', 'Food & Beverage', 'Finance', 'Education', 'Entertainment', 'Other'].map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelSt}>Notes (optional)</label>
                    <textarea value={client.notes} onChange={e => setStepData('client', { notes: e.target.value })} placeholder="Any notes..." rows={2} style={{ ...inputSt, resize: 'none', lineHeight: 1.6 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={prevStep} style={btnGhost}><ArrowLeft size={15} /></button>
                  <button onClick={createClient} disabled={loading || !client.clientName.trim()} style={{ ...btnPrimary, flex: 1, opacity: client.clientName.trim() ? 1 : 0.45 }}>
                    {loading ? 'Creating...' : <><span>Create Client</span><ArrowRight size={16} /></>}
                  </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: 12 }}>
                  <button onClick={nextStep} style={{ background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Skip for now</button>
                </p>
              </div>
            )}

            {/* ── STEP 4: Create Project ───────────────────────────────────── */}
            {step === 4 && (
              <div style={card}>
                <StepHeader emoji="📁" title="Create your first project" subtitle={client.clientName ? `This project will be linked to ${client.clientName}.` : 'Organize your work into projects.'} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={labelSt}>Project name *</label>
                    <input
                      value={project.projectName}
                      onChange={e => setStepData('project', { projectName: e.target.value })}
                      placeholder="e.g. Website Redesign Q2"
                      autoFocus
                      style={inputSt}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#f59e0b'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  {client.clientName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 10 }}>
                      <span style={{ fontSize: 13, color: '#8b949e' }}>Client: <strong style={{ color: '#06b6d4' }}>{client.clientName}</strong></span>
                    </div>
                  )}
                  <div>
                    <label style={labelSt}>Deadline (optional)</label>
                    <input type="date" value={project.deadline} onChange={e => setStepData('project', { deadline: e.target.value })} style={inputSt} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={prevStep} style={btnGhost}><ArrowLeft size={15} /></button>
                  <button onClick={createProject} disabled={loading || !project.projectName.trim()} style={{ ...btnPrimary, flex: 1, opacity: project.projectName.trim() ? 1 : 0.45 }}>
                    {loading ? 'Creating...' : <><span>Create Project</span><ArrowRight size={16} /></>}
                  </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: 12 }}>
                  <button onClick={nextStep} style={{ background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Skip for now</button>
                </p>
              </div>
            )}

            {/* ── STEP 5: Create Task ──────────────────────────────────────── */}
            {step === 5 && (
              <div style={card}>
                <StepHeader emoji="✅" title="Add your first task" subtitle={project.projectName ? `Added to "${project.projectName}"` : 'Break your work into actionable tasks.'} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={labelSt}>Task name *</label>
                    <input
                      value={task.taskName}
                      onChange={e => setStepData('task', { taskName: e.target.value })}
                      placeholder="e.g. Create homepage wireframes"
                      autoFocus
                      style={inputSt}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#10b981'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  {project.projectName && (
                    <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                      <span style={{ fontSize: 13, color: '#8b949e' }}>Project: <strong style={{ color: '#f59e0b' }}>{project.projectName}</strong></span>
                    </div>
                  )}
                  <div>
                    <label style={labelSt}>Due date (optional)</label>
                    <input type="date" value={task.dueDate} onChange={e => setStepData('task', { dueDate: e.target.value })} style={inputSt} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={prevStep} style={btnGhost}><ArrowLeft size={15} /></button>
                  <button onClick={createTask} disabled={loading || !task.taskName.trim()} style={{ ...btnPrimary, flex: 1, opacity: task.taskName.trim() ? 1 : 0.45 }}>
                    {loading ? 'Creating...' : <><span>Create Task</span><ArrowRight size={16} /></>}
                  </button>
                </div>
                <p style={{ textAlign: 'center', marginTop: 12 }}>
                  <button onClick={nextStep} style={{ background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Skip for now</button>
                </p>
              </div>
            )}

            {/* ── STEP 6: AI moment ────────────────────────────────────────── */}
            {step === 6 && (
              <div style={card}>
                <StepHeader emoji="🤖" title="Let AI help you get started" subtitle="Generate a campaign plan for your client in one click." />
                {!aiResult ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.14)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
                      <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.65, margin: 0 }}>
                        AI will generate a tailored campaign plan{client.clientName ? ` for ${client.clientName}` : ''} with actionable tasks.
                      </p>
                    </div>
                    <button onClick={generateAI} disabled={aiLoading} style={{ ...btnPrimary, marginBottom: 12 }}>
                      {aiLoading
                        ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Generating...</>
                        : <><Sparkles size={16} /> Generate Campaign Plan</>
                      }
                    </button>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={prevStep} style={btnGhost}><ArrowLeft size={15} /></button>
                      <button onClick={nextStep} style={{ ...btnGhost, flex: 1, justifyContent: 'center' }}>Skip →</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>💡 Campaign Idea</span>
                        <button onClick={() => { navigator.clipboard.writeText(aiResult.idea); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                          style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 0 }}>
                          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <p style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.65, margin: 0 }}>{aiResult.idea}</p>
                    </div>
                    <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: 18, marginBottom: 24 }}>
                      <p style={{ fontSize: 11, color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>✅ Suggested Tasks</p>
                      {aiResult.tasks.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: i < aiResult.tasks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.5 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={nextStep} style={btnPrimary}>Continue to Dashboard <ArrowRight size={16} /></button>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 7: Success ──────────────────────────────────────────── */}
            {step === 7 && (
              <div style={{ ...card, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🚀</div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f2f9', marginBottom: 12, letterSpacing: '-0.02em' }}>You're ready to go!</h1>
                <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.7, marginBottom: 28 }}>
                  Your workspace is set up{client.clientName ? ` with ${client.clientName}` : ''}. Let's start shipping.
                </p>
                {(client.clientName || project.projectName || task.taskName) && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 20px', marginBottom: 24, textAlign: 'left' }}>
                    <p style={{ fontSize: 11, color: '#6e7681', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Created</p>
                    {[
                      client.clientName && ['👤 Client', client.clientName],
                      project.projectName && ['📁 Project', project.projectName],
                      task.taskName && ['✅ Task', task.taskName],
                    ].filter(Boolean).map((item: any, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: 12, color: '#6e7681', minWidth: 64 }}>{item[0]}</span>
                        <span style={{ fontSize: 13, color: '#c9d1d9', fontWeight: 600 }}>{item[1]}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button onClick={finish} disabled={loading} style={btnPrimary}>
                    {loading ? 'Loading...' : <><Rocket size={16} /> Go to Dashboard</>}
                  </button>
                  <button onClick={() => router.replace('/dashboard/team')} style={btnGhost}>
                    <Users size={15} /> Invite your team
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
