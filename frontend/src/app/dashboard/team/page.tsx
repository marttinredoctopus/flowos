'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-500/20 text-purple-400',
  manager: 'bg-blue-500/20 text-blue-400',
  member: 'bg-slate-500/20 text-slate-300',
  viewer: 'bg-green-500/20 text-green-400',
};

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'member' });
  const [saving, setSaving] = useState(false);
  const [invited, setInvited] = useState<{ name: string; email: string; tempPassword: string } | null>(null);

  useEffect(() => { load(); }, []);

  function load() {
    apiClient.get('/team').then(r => setMembers(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await apiClient.post('/team/invite', form);
      setInvited({ name: r.data.name, email: r.data.email, tempPassword: r.data.tempPassword });
      setForm({ name: '', email: '', role: 'member' });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to invite member');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Team</h1>
          <p className="text-slate-400 text-sm mt-1">{members.length} members</p>
        </div>
        <button onClick={() => { setShowInvite(true); setInvited(null); }} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ Invite Member</button>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-white">Invite Team Member</h2>
              <button onClick={() => setShowInvite(false)} className="text-slate-500 hover:text-white transition text-xl">✕</button>
            </div>

            {invited ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-green-400 text-sm font-semibold mb-2">✓ Invitation created!</p>
                  <p className="text-slate-300 text-sm">Share these credentials with <strong>{invited.name}</strong>:</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-white font-mono">{invited.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Temp Password:</span>
                    <span className="text-brand-blue font-mono font-semibold">{invited.tempPassword}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Ask the member to log in and change their password immediately.</p>
                <button onClick={() => { setShowInvite(false); setInvited(null); }} className="w-full py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white">Done</button>
              </div>
            ) : (
              <form onSubmit={invite} className="space-y-4">
                <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Full name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input required type="email" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Email address *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowInvite(false)} className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Inviting...' : 'Send Invite'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : members.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">👤</div>
          <p className="text-slate-400 mb-4">No team members yet</p>
          <button onClick={() => setShowInvite(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white text-sm">Invite First Member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m: any) => (
            <div key={m.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition">
              <div className="w-12 h-12 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center text-lg font-bold text-white">{m.name?.[0]?.toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{m.name}</p>
                <p className="text-xs text-slate-500 truncate">{m.email}</p>
                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[m.role] || 'bg-white/5 text-slate-400'}`}>{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
