'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-500/20 text-purple-400',
  manager: 'bg-blue-500/20 text-blue-400',
  member: 'bg-slate-500/20 text-slate-300',
};

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/team').then(r => setMembers(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Team</h1>
        <p className="text-slate-400 text-sm mt-1">{members.length} members</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : members.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">👤</div>
          <p className="text-slate-400 mb-2">No team members yet</p>
          <p className="text-slate-500 text-sm">Invite people from Settings → Team</p>
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
