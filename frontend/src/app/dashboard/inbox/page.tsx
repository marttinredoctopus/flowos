'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

const TYPE_ICONS: Record<string, string> = {
  task_assigned: '✅',
  comment_added: '💬',
  mentioned: '@',
  task_due_soon: '⏰',
  task_overdue: '🔴',
  project_completed: '🎉',
  default: '🔔',
};

export default function InboxPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'task' | 'comment'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => { loadNotifications(); }, [filter]);

  async function loadNotifications(p = 1) {
    setLoading(true);
    try {
      const r = await apiClient.get('/notifications', { params: { page: p, limit: 20 } });
      const all = r.data.notifications || [];
      const filtered = filter === 'unread' ? all.filter((n: any) => !n.is_read)
        : filter === 'task' ? all.filter((n: any) => n.type.startsWith('task'))
        : filter === 'comment' ? all.filter((n: any) => n.type === 'comment_added')
        : all;
      if (p === 1) setNotifications(filtered);
      else setNotifications(prev => [...prev, ...filtered]);
      setHasMore(all.length === 20);
      setPage(p);
    } catch {} finally { setLoading(false); }
  }

  async function markRead(id: string) {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  }

  async function markAllRead() {
    try {
      await apiClient.post('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All marked as read');
    } catch {}
  }

  async function deleteNotification(id: string) {
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Inbox</h1>
          <p className="text-slate-400 text-sm mt-1">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="px-4 py-2 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white hover:border-white/20 transition">
            Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'task', 'comment'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${filter === f ? 'bg-brand-blue/20 text-brand-blue' : 'text-slate-400 hover:text-white bg-white/5'}`}>
            {f === 'all' ? `All (${notifications.length})` : f === 'unread' ? `Unread (${unreadCount})` : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-5xl mb-4">📥</div>
          <p className="text-white font-semibold mb-2">You're all caught up!</p>
          <p className="text-slate-400 text-sm">No {filter !== 'all' ? filter : ''} notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer group ${n.is_read ? 'bg-white/2 border-white/5' : 'bg-brand-blue/5 border-brand-blue/20 hover:bg-brand-blue/8'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${n.is_read ? 'bg-white/5' : 'bg-brand-blue/10'}`}>
                {TYPE_ICONS[n.type] || TYPE_ICONS.default}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${n.is_read ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.is_read && <span className="w-2 h-2 bg-brand-blue rounded-full" />}
                    <span className="text-xs text-slate-500">{timeAgo(n.created_at)}</span>
                  </div>
                </div>
                {n.body && <p className="text-xs text-slate-500 mt-0.5 truncate">{n.body}</p>}
                {n.actor_name && <p className="text-xs text-slate-600 mt-0.5">by {n.actor_name}</p>}
              </div>
              <button onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 text-xs transition flex-shrink-0">✕</button>
            </div>
          ))}

          {hasMore && (
            <button onClick={() => loadNotifications(page + 1)}
              className="w-full py-3 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition">
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
