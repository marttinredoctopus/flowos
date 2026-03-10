'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await apiClient.patch('/auth/profile', { name }); toast.success('Profile updated!'); }
    catch { toast.error('Failed to update'); } finally { setSaving(false); }
  }

  function handleLogout() { logout(); router.replace('/'); }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8"><h1 className="font-display text-2xl font-bold text-white">Settings</h1></div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-white mb-5">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-2xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full mt-1 inline-block">{user?.role}</span>
            </div>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Display Name</label>
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-blue/50" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Email</label>
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm cursor-not-allowed" value={user?.email || ''} disabled />
            </div>
            <button type="submit" disabled={saving} className="px-6 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="bg-[#0f1117] border border-red-500/20 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-white mb-4">Account</h2>
          <button onClick={handleLogout} className="px-5 py-2.5 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/10 transition">Sign Out</button>
        </div>
      </div>
    </div>
  );
}
