'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const CATEGORIES = ['Revenue','Growth','Team','Client','Marketing','Other'];
const STATUSES = ['on_track','at_risk','off_track','completed'];
const STATUS_COLOR: Record<string,string> = {
  on_track: 'text-green-400 bg-green-500/10 border-green-500/20',
  at_risk: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  off_track: 'text-red-400 bg-red-500/10 border-red-500/20',
  completed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

function ProgressRing({ progress, size = 60 }: { progress: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, progress) / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#1e293b" strokeWidth="6" fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke="#4f8cff" strokeWidth="6" fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2} textAnchor="middle" dy="4" fill="white" fontSize="11" fontWeight="700">
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeGoal, setActiveGoal] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'Revenue', dueDate: '', status: 'on_track' });
  const [saving, setSaving] = useState(false);
  const [krForm, setKrForm] = useState({ title: '', targetValue: '', unit: '', startValue: '0' });
  const [addingKr, setAddingKr] = useState(false);

  useEffect(() => { loadGoals(); }, []);

  async function loadGoals() {
    try {
      const r = await apiClient.get('/goals');
      setGoals(r.data);
    } catch {} finally { setLoading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const r = await apiClient.post('/goals', form);
      setGoals(prev => [r.data, ...prev]);
      setForm({ title: '', description: '', category: 'Revenue', dueDate: '', status: 'on_track' });
      setShowCreate(false);
      toast.success('Goal created!');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function openGoal(goal: any) {
    try {
      const r = await apiClient.get(`/goals/${goal.id}`);
      setActiveGoal(r.data);
    } catch {}
  }

  async function addKr(e: React.FormEvent) {
    e.preventDefault(); if (!activeGoal) return; setAddingKr(true);
    try {
      const r = await apiClient.post(`/goals/${activeGoal.id}/key-results`, {
        title: krForm.title,
        targetValue: parseFloat(krForm.targetValue),
        startValue: parseFloat(krForm.startValue || '0'),
        unit: krForm.unit,
      });
      setActiveGoal((g: any) => ({ ...g, key_results: [...(g.key_results || []), r.data] }));
      setKrForm({ title: '', targetValue: '', unit: '', startValue: '0' });
      toast.success('Key result added!');
    } catch { toast.error('Failed'); } finally { setAddingKr(false); }
  }

  async function updateKrValue(krId: string, currentValue: number) {
    if (!activeGoal) return;
    try {
      const r = await apiClient.patch(`/goals/${activeGoal.id}/key-results/${krId}`, { currentValue });
      setActiveGoal((g: any) => ({ ...g, key_results: g.key_results.map((kr: any) => kr.id === krId ? r.data : kr) }));
      await loadGoals();
    } catch {}
  }

  async function deleteGoal(id: string) {
    if (!confirm('Delete this goal?')) return;
    try {
      await apiClient.delete(`/goals/${id}`);
      setGoals(prev => prev.filter(g => g.id !== id));
      if (activeGoal?.id === id) setActiveGoal(null);
      toast.success('Deleted');
    } catch {}
  }

  return (
    <div className="flex h-full">
      {/* Goals list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 max-w-4xl">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Goals & OKRs</h1>
            <p className="text-slate-400 text-sm mt-1">Track objectives and key results</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90">
            + New Goal
          </button>
        </div>

        {loading ? (
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : goals.length === 0 ? (
          <div className="max-w-4xl text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-white font-semibold mb-2">Set your first goal</p>
            <p className="text-slate-400 text-sm mb-6">Define clear objectives and track progress with key results</p>
            <button onClick={() => setShowCreate(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">+ Create Goal</button>
          </div>
        ) : (
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => (
              <div key={goal.id} onClick={() => openGoal(goal)}
                className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-white/10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLOR[goal.status]}`}>
                        {goal.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">{goal.category}</span>
                    </div>
                    <p className="font-semibold text-white text-sm">{goal.title}</p>
                    {goal.owner_name && <p className="text-xs text-slate-500 mt-0.5">{goal.owner_name}</p>}
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <ProgressRing progress={goal.progress || 0} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {goal.due_date && <span className="text-xs text-slate-500">Due {new Date(goal.due_date).toLocaleDateString()}</span>}
                  <button onClick={e => { e.stopPropagation(); deleteGoal(goal.id); }}
                    className="opacity-0 group-hover:opacity-100 text-xs text-slate-600 hover:text-red-400 transition ml-auto">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal detail panel */}
      {activeGoal && (
        <div className="w-96 border-l border-white/5 flex flex-col overflow-hidden bg-[#0c0d11]">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">{activeGoal.title}</h2>
            <button onClick={() => setActiveGoal(null)} className="text-slate-500 hover:text-white text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center mb-6">
              <ProgressRing progress={activeGoal.progress || 0} size={80} />
              <p className="text-slate-400 text-xs mt-2">{Math.round(activeGoal.progress || 0)}% complete</p>
            </div>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Key Results</h3>
            <div className="space-y-3 mb-4">
              {(activeGoal.key_results || []).map((kr: any) => {
                const pct = kr.target_value === kr.start_value ? 0 :
                  Math.max(0, Math.min(100, ((kr.current_value - kr.start_value) / (kr.target_value - kr.start_value)) * 100));
                return (
                  <div key={kr.id} className="bg-white/5 rounded-xl p-3">
                    <p className="text-white text-xs font-medium mb-2">{kr.title}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-white/10 rounded-full h-1.5">
                        <div className="gradient-bg h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{Math.round(pct)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{kr.current_value} / {kr.target_value} {kr.unit}</span>
                      <input type="number" defaultValue={kr.current_value}
                        onBlur={e => updateKrValue(kr.id, parseFloat(e.target.value))}
                        className="ml-auto w-20 px-2 py-1 bg-[#0f1117] border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        placeholder="Update" />
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={addKr} className="space-y-2 bg-white/5 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-400">+ Add Key Result</p>
              <input required value={krForm.title} onChange={e => setKrForm({...krForm, title: e.target.value})}
                className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none"
                placeholder="e.g. Reach $100K ARR" />
              <div className="flex gap-2">
                <input required type="number" value={krForm.targetValue} onChange={e => setKrForm({...krForm, targetValue: e.target.value})}
                  className="flex-1 px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none"
                  placeholder="Target" />
                <input value={krForm.unit} onChange={e => setKrForm({...krForm, unit: e.target.value})}
                  className="w-20 px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none"
                  placeholder="Unit" />
              </div>
              <button type="submit" disabled={addingKr}
                className="w-full py-2 gradient-bg rounded-lg text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
                {addingKr ? 'Adding…' : 'Add Key Result'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-white">New Goal</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50"
                placeholder="Goal title *" />
              <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none resize-none"
                placeholder="Description (optional)" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? 'Creating…' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
