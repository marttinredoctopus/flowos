'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

const STATUS_C: Record<string,string> = {
  scheduled: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};
const TYPE_C: Record<string,string> = {
  call: 'bg-purple-500/20 text-purple-400',
  in_person: 'bg-yellow-500/20 text-yellow-400',
  video: 'bg-blue-500/20 text-blue-400',
};
const EMPTY = { title: '', description: '', meetingType: 'video', scheduledAt: '', durationMinutes: '60', location: '', meetLink: '' };

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/meetings'); setMeetings(r.data || []); }
    catch {} finally { setLoading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.scheduledAt) return;
    setSaving(true);
    try {
      await apiClient.post('/meetings', { ...form, durationMinutes: parseInt(form.durationMinutes) });
      setShowModal(false); setForm(EMPTY); load();
    } catch {} finally { setSaving(false); }
  }

  async function remove(id: string) {
    await apiClient.delete(`/meetings/${id}`);
    setMeetings(m => m.filter(x => x.id !== id));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Meetings</h1>
          <p className="text-slate-400 text-sm mt-1">{meetings.length} upcoming</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">+ Schedule</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-5xl mb-4">🎥</div>
          <p className="text-slate-400 mb-4">No meetings scheduled</p>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">Schedule Meeting</button>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m.id} className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition flex items-center gap-5 group">
              <div className="w-12 h-12 gradient-bg rounded-xl flex-shrink-0 flex items-center justify-center text-xl">🎥</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{m.title}</p>
                <p className="text-sm text-slate-400 mt-0.5">
                  {new Date(m.scheduled_at).toLocaleString()} · {m.duration_minutes}min
                  {m.client_name && ` · ${m.client_name}`}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${TYPE_C[m.meeting_type] || TYPE_C.video}`}>{m.meeting_type?.replace('_',' ')}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_C[m.status] || STATUS_C.scheduled}`}>{m.status}</span>
              {m.meet_link ? (
                <a href={m.meet_link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white hover:border-white/20 transition flex-shrink-0">Join</a>
              ) : null}
              <button onClick={() => remove(m.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition text-xs flex-shrink-0">✕</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-white">Schedule Meeting</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <input required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="Meeting title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <select className="w-full px-4 py-2.5 bg-[#0c0d11] border border-white/10 rounded-xl text-white text-sm focus:outline-none" value={form.meetingType} onChange={e => setForm({...form, meetingType: e.target.value})}>
                  <option value="video">Video Call</option>
                  <option value="call">Phone Call</option>
                  <option value="in_person">In Person</option>
                </select>
                <input type="number" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Duration (min)" value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: e.target.value})} />
              </div>
              <input required type="datetime-local" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-blue/50" value={form.scheduledAt} onChange={e => setForm({...form, scheduledAt: e.target.value})} />
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Meet link (optional)" value={form.meetLink} onChange={e => setForm({...form, meetLink: e.target.value})} />
              <input className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Location (optional)" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? 'Saving...' : 'Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
