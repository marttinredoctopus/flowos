'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

type Tab = 'general' | 'profile' | 'team' | 'notifications' | 'appearance' | 'finance' | 'api' | 'webhooks' | 'danger';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'team', label: 'Team & Roles', icon: '👥' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'api', label: 'API Keys', icon: '🔑' },
  { id: 'webhooks', label: 'Webhooks', icon: '🔗' },
  { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
];

const INPUT = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition';
const BTN = 'px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50';
const CARD = 'bg-[#0f1117] border border-white/5 rounded-2xl p-6 mb-4';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-white/10'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function GeneralTab() {
  const [org, setOrg] = useState({ name: '', logoUrl: '', timezone: 'UTC', language: 'en' });
  const [saving, setSaving] = useState(false);
  useEffect(() => { apiClient.get('/org/settings').then(r => setOrg(o => ({ ...o, ...r.data }))).catch(() => {}); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await apiClient.patch('/org/settings', org); toast.success('Saved'); }
    catch { toast.error('Failed'); } finally { setSaving(false); }
  }
  return (
    <form onSubmit={save}>
      <div className={CARD}>
        <h2 className="font-display font-semibold text-white mb-5">Organization</h2>
        <div className="space-y-4">
          <div><label className="text-sm text-slate-400 block mb-1.5">Name</label><input className={INPUT} value={org.name} onChange={e => setOrg(o => ({ ...o, name: e.target.value }))} /></div>
          <div><label className="text-sm text-slate-400 block mb-1.5">Logo URL</label><input className={INPUT} value={org.logoUrl || ''} onChange={e => setOrg(o => ({ ...o, logoUrl: e.target.value }))} placeholder="https://..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-slate-400 block mb-1.5">Timezone</label>
              <select className={INPUT} value={org.timezone} onChange={e => setOrg(o => ({ ...o, timezone: e.target.value }))}>
                {['UTC','America/New_York','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Dubai','Asia/Riyadh','Asia/Tokyo'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-slate-400 block mb-1.5">Language</label>
              <select className={INPUT} value={org.language} onChange={e => setOrg(o => ({ ...o, language: e.target.value }))}>
                <option value="en">English</option><option value="ar">Arabic</option><option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <button type="submit" disabled={saving} className={BTN}>{saving ? 'Saving...' : 'Save Changes'}</button>
    </form>
  );
}

function ProfileTab() {
  const { user, setAuth, accessToken } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', jobTitle: '', phone: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { const r = await apiClient.patch('/auth/profile', form); if (user) setAuth(r.data, accessToken!); toast.success('Profile updated'); }
    catch { toast.error('Failed'); } finally { setSaving(false); }
  }
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return void toast.error('Passwords do not match');
    setChangingPw(true);
    try { await apiClient.post('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }); toast.success('Password changed'); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); } finally { setChangingPw(false); }
  }
  return (
    <div>
      <div className={CARD}>
        <h2 className="font-display font-semibold text-white mb-5">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-2xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</div>
          <div><p className="font-semibold text-white">{user?.name}</p><p className="text-sm text-slate-400">{user?.email}</p><span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{user?.role}</span></div>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div><label className="text-sm text-slate-400 block mb-1.5">Display Name</label><input className={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="text-sm text-slate-400 block mb-1.5">Email</label><input className={INPUT + ' opacity-50 cursor-not-allowed'} value={user?.email || ''} disabled /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-slate-400 block mb-1.5">Job Title</label><input className={INPUT} value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} placeholder="Creative Director" /></div>
            <div><label className="text-sm text-slate-400 block mb-1.5">Phone</label><input className={INPUT} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900" /></div>
          </div>
          <button type="submit" disabled={saving} className={BTN}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
      <div className={CARD}>
        <h2 className="font-display font-semibold text-white mb-5">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div><label className="text-sm text-slate-400 block mb-1.5">Current Password</label><input type="password" className={INPUT} value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} /></div>
          <div><label className="text-sm text-slate-400 block mb-1.5">New Password</label><input type="password" className={INPUT} value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} /></div>
          <div><label className="text-sm text-slate-400 block mb-1.5">Confirm New Password</label><input type="password" className={INPUT} value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} /></div>
          <button type="submit" disabled={changingPw} className={BTN}>{changingPw ? 'Changing...' : 'Change Password'}</button>
        </form>
      </div>
    </div>
  );
}

function TeamTab() {
  const { user } = useAuthStore();
  const [members, setMembers] = useState<any[]>([]);
  useEffect(() => { apiClient.get('/org/team').then(r => setMembers(r.data || [])).catch(() => {}); }, []);
  async function changeRole(id: string, role: string) {
    try { await apiClient.patch(`/org/team/${id}/role`, { role }); setMembers(m => m.map(u => u.id === id ? { ...u, role } : u)); toast.success('Role updated'); }
    catch { toast.error('Failed'); }
  }
  async function remove(id: string) {
    if (!confirm('Remove this member?')) return;
    try { await apiClient.delete(`/org/team/${id}`); setMembers(m => m.filter(u => u.id !== id)); toast.success('Removed'); }
    catch { toast.error('Failed'); }
  }
  return (
    <div className={CARD}>
      <h2 className="font-display font-semibold text-white mb-5">Team Members ({members.length})</h2>
      <div className="space-y-1">
        {members.map(m => (
          <div key={m.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{m.name?.[0]?.toUpperCase()}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{m.name}</p><p className="text-xs text-slate-500 truncate">{m.email}</p></div>
            {user?.role === 'admin' && m.id !== user.id ? (
              <>
                <select value={m.role} onChange={e => changeRole(m.id, e.target.value)} className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none">
                  <option value="admin">Admin</option><option value="manager">Manager</option><option value="member">Member</option>
                </select>
                <button onClick={() => remove(m.id)} className="text-xs text-red-400 hover:text-red-300 transition">Remove</button>
              </>
            ) : <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg capitalize">{m.role}</span>}
          </div>
        ))}
        {members.length === 0 && <p className="text-slate-500 text-sm py-4 text-center">No team members</p>}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({ emailOnTaskAssigned: true, emailOnProjectUpdated: true, emailOnMention: true, emailOnDeadline: true, browserNotifications: false });
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    try { await apiClient.patch('/auth/profile', { notificationPrefs: prefs }); toast.success('Saved'); }
    catch { toast.error('Failed'); } finally { setSaving(false); }
  }
  const items = [
    { key: 'emailOnTaskAssigned', label: 'Task assigned to me', desc: 'Email when a task is assigned to you' },
    { key: 'emailOnProjectUpdated', label: 'Project updates', desc: 'Email when project status changes' },
    { key: 'emailOnMention', label: 'Mentions', desc: 'Email when someone mentions you' },
    { key: 'emailOnDeadline', label: 'Deadline reminders', desc: '24h before a task is due' },
    { key: 'browserNotifications', label: 'Browser notifications', desc: 'Real-time in-browser push notifications' },
  ];
  return (
    <div className={CARD}>
      <h2 className="font-display font-semibold text-white mb-5">Notifications</h2>
      <div className="space-y-5">
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-white">{item.label}</p><p className="text-xs text-slate-500 mt-0.5">{item.desc}</p></div>
            <Toggle value={(prefs as any)[item.key]} onChange={v => setPrefs(p => ({ ...p, [item.key]: v }))} />
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className={BTN + ' mt-6'}>{saving ? 'Saving...' : 'Save Preferences'}</button>
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className={CARD}>
      <h2 className="font-display font-semibold text-white mb-5">Appearance</h2>
      <div>
        <p className="text-sm font-medium text-white mb-3">Theme</p>
        <div className="grid grid-cols-2 gap-3">
          {(['dark', 'light'] as const).map(t => (
            <button key={t} onClick={() => setTheme(t)} className={`p-4 rounded-xl border-2 text-left transition ${theme === t ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              <div className={`w-full h-10 rounded-lg mb-2 ${t === 'dark' ? 'bg-[#070b0f]' : 'bg-slate-200'}`}>
                <div className={`w-1/2 h-2 rounded m-2 ${t === 'dark' ? 'bg-white/20' : 'bg-slate-400'}`} />
              </div>
              <p className="text-sm font-medium text-white capitalize">{t} Mode</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinanceTab() {
  const [cfg, setCfg] = useState({ currency: 'USD', defaultPaymentTerms: 30, invoicePrefix: 'INV', defaultTaxRate: 0, companyAddress: '' });
  const [saving, setSaving] = useState(false);
  useEffect(() => { apiClient.get('/invoices/finance-settings').then(r => { if (r.data) setCfg(c => ({ ...c, ...r.data })); }).catch(() => {}); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await apiClient.patch('/invoices/finance-settings', cfg); toast.success('Saved'); }
    catch { toast.error('Failed'); } finally { setSaving(false); }
  }
  return (
    <form onSubmit={save}>
      <div className={CARD}>
        <h2 className="font-display font-semibold text-white mb-5">Finance Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-slate-400 block mb-1.5">Currency</label>
              <select className={INPUT} value={cfg.currency} onChange={e => setCfg(c => ({ ...c, currency: e.target.value }))}>
                {['USD','EUR','GBP','AED','SAR','CAD','AUD'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-sm text-slate-400 block mb-1.5">Payment Terms</label>
              <select className={INPUT} value={cfg.defaultPaymentTerms} onChange={e => setCfg(c => ({ ...c, defaultPaymentTerms: +e.target.value }))}>
                {[7,15,30,45,60].map(d => <option key={d} value={d}>Net {d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-slate-400 block mb-1.5">Invoice Prefix</label><input className={INPUT} value={cfg.invoicePrefix} onChange={e => setCfg(c => ({ ...c, invoicePrefix: e.target.value }))} placeholder="INV" /></div>
            <div><label className="text-sm text-slate-400 block mb-1.5">Default Tax Rate (%)</label><input type="number" min="0" max="100" step="0.01" className={INPUT} value={cfg.defaultTaxRate} onChange={e => setCfg(c => ({ ...c, defaultTaxRate: +e.target.value }))} /></div>
          </div>
          <div><label className="text-sm text-slate-400 block mb-1.5">Company Address</label><textarea className={INPUT + ' h-20 resize-none'} value={cfg.companyAddress} onChange={e => setCfg(c => ({ ...c, companyAddress: e.target.value }))} /></div>
        </div>
      </div>
      <button type="submit" disabled={saving} className={BTN}>{saving ? 'Saving...' : 'Save Finance Settings'}</button>
    </form>
  );
}

function ApiKeysTab() {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  useEffect(() => { apiClient.get('/api-keys').then(r => setKeys(r.data || [])).catch(() => {}); }, []);
  async function create() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try { const r = await apiClient.post('/api-keys', { name: newKeyName }); setNewKeyValue(r.data.key); setKeys(k => [...k, r.data.apiKey || r.data]); setNewKeyName(''); setShowModal(true); }
    catch { toast.error('Failed to create key'); } finally { setCreating(false); }
  }
  async function revoke(id: string) {
    if (!confirm('Revoke this API key?')) return;
    try { await apiClient.patch(`/api-keys/${id}/revoke`); setKeys(k => k.map(key => key.id === id ? { ...key, is_active: false } : key)); toast.success('Revoked'); }
    catch { toast.error('Failed'); }
  }
  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="font-display font-bold text-white mb-2">API Key Created</h3>
            <p className="text-sm text-yellow-400 mb-4">Copy this key now — it won't be shown again.</p>
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-3 mb-4">
              <code className="text-xs text-green-400 flex-1 break-all">{newKeyValue}</code>
              <button onClick={() => { navigator.clipboard.writeText(newKeyValue); toast.success('Copied!'); }} className="text-xs text-blue-400 border border-white/10 rounded-lg px-2 py-1">Copy</button>
            </div>
            <button onClick={() => setShowModal(false)} className={BTN + ' w-full'}>Done</button>
          </div>
        </div>
      )}
      <div className={CARD}>
        <h2 className="font-display font-semibold text-white mb-5">API Keys</h2>
        <div className="flex gap-3 mb-5">
          <input className={INPUT} placeholder="Key name" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} onKeyDown={e => e.key === 'Enter' && create()} />
          <button onClick={create} disabled={creating || !newKeyName.trim()} className={BTN + ' whitespace-nowrap'}>{creating ? 'Creating...' : '+ Create'}</button>
        </div>
        <div className="space-y-1">
          {keys.map(k => (
            <div key={k.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="text-sm font-medium text-white">{k.name}</p><span className={`text-xs px-2 py-0.5 rounded-full ${k.is_active !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{k.is_active !== false ? 'Active' : 'Revoked'}</span></div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{k.key_prefix || 'fos_live_****'}...</p>
              </div>
              <p className="text-xs text-slate-500">{k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : 'Never used'}</p>
              {k.is_active !== false && <button onClick={() => revoke(k.id)} className="text-xs text-red-400 hover:text-red-300">Revoke</button>}
            </div>
          ))}
          {keys.length === 0 && <p className="text-slate-500 text-sm py-4 text-center">No API keys yet</p>}
        </div>
      </div>
    </div>
  );
}

const ALL_EVENTS = ['task.created','task.updated','task.completed','project.created','project.updated','client.created','invoice.created','invoice.paid'];

function WebhooksTab() {
  const [hooks, setHooks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ url: '', description: '', events: [] as string[] });
  useEffect(() => { apiClient.get('/webhooks').then(r => setHooks(r.data || [])).catch(() => {}); }, []);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url || form.events.length === 0) return void toast.error('URL and at least one event required');
    try { const r = await apiClient.post('/webhooks', form); setHooks(h => [...h, r.data]); setShowModal(false); setForm({ url: '', description: '', events: [] }); toast.success('Webhook created'); }
    catch { toast.error('Failed'); }
  }
  async function remove(id: string) {
    if (!confirm('Delete this webhook?')) return;
    try { await apiClient.delete(`/webhooks/${id}`); setHooks(h => h.filter(w => w.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  }
  async function test(id: string) {
    try { await apiClient.post(`/webhooks/${id}/test`); toast.success('Test sent'); }
    catch { toast.error('Test failed'); }
  }
  function toggleEvent(ev: string) { setForm(f => ({ ...f, events: f.events.includes(ev) ? f.events.filter(e => e !== ev) : [...f.events, ev] })); }
  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-white mb-4">Create Webhook</h3>
            <form onSubmit={create} className="space-y-4">
              <div><label className="text-sm text-slate-400 block mb-1.5">URL</label><input className={INPUT} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://your-server.com/webhook" /></div>
              <div><label className="text-sm text-slate-400 block mb-1.5">Description</label><input className={INPUT} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div><label className="text-sm text-slate-400 block mb-2">Events</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_EVENTS.map(ev => (
                    <label key={ev} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.events.includes(ev)} onChange={() => toggleEvent(ev)} className="rounded border-white/20 bg-white/5 text-blue-500" />
                      <span className="text-xs text-slate-300 font-mono">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className={BTN + ' flex-1'}>Create</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-5 py-2.5 border border-white/10 text-slate-400 rounded-xl text-sm hover:bg-white/5 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-white">Webhooks</h2>
          <button onClick={() => setShowModal(true)} className={BTN}>+ Add Webhook</button>
        </div>
        <div className="space-y-3">
          {hooks.map(h => (
            <div key={h.id} className="border border-white/5 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-blue-400 truncate">{h.url}</p>
                  {h.description && <p className="text-xs text-slate-500 mt-0.5">{h.description}</p>}
                  <div className="flex flex-wrap gap-1 mt-2">{(h.events || []).map((ev: string) => <span key={ev} className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded font-mono">{ev}</span>)}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => test(h.id)} className="text-xs text-blue-400 border border-white/10 rounded-lg px-2 py-1">Test</button>
                  <button onClick={() => remove(h.id)} className="text-xs text-red-400 border border-red-500/20 rounded-lg px-2 py-1">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {hooks.length === 0 && <p className="text-slate-500 text-sm py-4 text-center">No webhooks configured</p>}
        </div>
      </div>
    </div>
  );
}

function DangerTab() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  function handleLogout() { logout(); router.replace('/'); }
  return (
    <div>
      <div className={CARD}>
        <h2 className="font-display font-semibold text-white mb-4">Sign Out</h2>
        <p className="text-sm text-slate-400 mb-4">Sign out of your account on this device.</p>
        <button onClick={handleLogout} className="px-5 py-2.5 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/10 transition">Sign Out</button>
      </div>
      <div className="bg-[#0f1117] border border-red-500/20 rounded-2xl p-6">
        <h2 className="font-display font-semibold text-white mb-4">Delete Account</h2>
        <p className="text-sm text-slate-400 mb-4">Permanently delete your account and all data. Cannot be undone.</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition">Delete My Account</button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-400">Type <strong>DELETE</strong> to confirm:</p>
            <input className={INPUT} value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE" />
            <div className="flex gap-3">
              <button disabled={confirmText !== 'DELETE'} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-red-600 transition">Confirm Delete</button>
              <button onClick={() => { setShowDelete(false); setConfirmText(''); }} className="px-5 py-2.5 border border-white/10 text-slate-400 rounded-xl text-sm hover:bg-white/5 transition">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general');
  const tabContent: Record<Tab, React.ReactNode> = {
    general: <GeneralTab />, profile: <ProfileTab />, team: <TeamTab />, notifications: <NotificationsTab />,
    appearance: <AppearanceTab />, finance: <FinanceTab />, api: <ApiKeysTab />, webhooks: <WebhooksTab />, danger: <DangerTab />,
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Settings</h1>
      <div className="flex gap-6">
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition ${tab === t.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{tabContent[tab]}</div>
      </div>
    </div>
  );
}
