'use client';
import { useEffect, useRef, useState } from 'react';
import apiClient from '@/lib/apiClient';

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    apiClient.get('/time-entries').then(r => setEntries(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function startTimer() {
    if (!desc.trim()) return;
    setRunning(true);
    setStartTime(new Date());
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }

  async function stopTimer() {
    clearInterval(timerRef.current);
    setRunning(false);
    if (startTime) {
      try {
        await apiClient.post('/time-entries', {
          description: desc,
          durationSeconds: elapsed,
          startedAt: startTime.toISOString(),
          endedAt: new Date().toISOString(),
        });
        const r = await apiClient.get('/time-entries');
        setEntries(r.data || []);
      } catch {}
    }
    setElapsed(0);
    setDesc('');
    setStartTime(null);
  }

  const totalToday = entries.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).reduce((a, e) => a + (e.duration_seconds || 0), 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Time Tracking</h1>
        <p className="text-slate-400 text-sm mt-1">Today: {formatTime(totalToday)}</p>
      </div>

      {/* Timer */}
      <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-8 mb-8 text-center">
        <div className="font-display text-6xl font-bold gradient-text mb-6 tabular-nums tracking-wider">{formatTime(elapsed)}</div>
        <div className="flex gap-3 max-w-sm mx-auto mb-4">
          <input className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50" placeholder="What are you working on?" value={desc} onChange={e => setDesc(e.target.value)} disabled={running} />
        </div>
        <button onClick={running ? stopTimer : startTimer} disabled={!running && !desc.trim()} className={`px-8 py-3 rounded-xl font-semibold text-white transition ${running ? 'bg-red-500 hover:bg-red-600' : 'gradient-bg hover:opacity-90'} disabled:opacity-40`}>
          {running ? '⏹ Stop' : '▶ Start Timer'}
        </button>
      </div>

      {/* Log */}
      <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5"><h2 className="font-semibold text-white">Recent Entries</h2></div>
        {loading ? <div className="p-5 space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse"/>)}</div>
        : entries.length === 0 ? <div className="text-center py-12 text-slate-400 text-sm">No time entries yet</div>
        : entries.slice(0,20).map((e: any, i) => (
          <div key={e.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition ${i ? 'border-t border-white/5' : ''}`}>
            <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{e.description || 'No description'}</p><p className="text-xs text-slate-500">{new Date(e.created_at).toLocaleDateString()}</p></div>
            <span className="font-mono text-sm text-brand-blue font-semibold">{formatTime(e.duration_seconds || 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
