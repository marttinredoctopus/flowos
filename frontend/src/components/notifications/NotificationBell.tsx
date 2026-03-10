'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
  actor_name?: string;
  actor_avatar?: string;
}

const TYPE_ICON: Record<string, string> = {
  task_assigned: '📋',
  task_due_soon: '⏰',
  task_overdue: '🔴',
  task_review_needed: '👀',
  task_approved: '✅',
  task_rejected: '❌',
  comment_added: '💬',
  mentioned: '📣',
  file_uploaded: '📁',
  project_completed: '🏆',
  project_added: '📂',
  client_approved: '🎉',
};

export default function NotificationBell() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    // Close on outside click
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Socket.io for real-time
  useEffect(() => {
    if (!accessToken) return;
    let socket: any;
    (async () => {
      const { io } = await import('socket.io-client');
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        auth: { token: accessToken },
        transports: ['websocket', 'polling'],
      });
      socket.on('notification:new', (notif: Notification) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(c => c + 1);
        if (!open) {
          toast.custom((t) => (
            <div className={`glass border border-white/10 rounded-xl p-4 max-w-sm animate-slide-up ${t.visible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{TYPE_ICON[notif.type] || '🔔'}</span>
                <div>
                  <p className="text-sm font-medium text-white">{notif.title}</p>
                  {notif.body && <p className="text-xs text-slate-400 mt-0.5">{notif.body}</p>}
                </div>
              </div>
            </div>
          ), { duration: 4000, position: 'bottom-right' });
        }
      });
      socket.on('notification:count', ({ count }: { count: number }) => {
        setUnreadCount(count);
      });
    })();
    return () => socket?.disconnect();
  }, [accessToken, open]);

  async function loadNotifications() {
    try {
      const res = await apiClient.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {}
  }

  async function markRead(id: string, url?: string) {
    await apiClient.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
    if (url) router.push(url);
    setOpen(false);
  }

  async function markAllRead() {
    await apiClient.patch('/notifications/read-all').catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  function group(notifs: Notification[]) {
    const groups: { label: string; items: Notification[] }[] = [];
    const todayItems = notifs.filter(n => new Date(n.created_at).toDateString() === today);
    const yestItems = notifs.filter(n => new Date(n.created_at).toDateString() === yesterday);
    const olderItems = notifs.filter(n => {
      const d = new Date(n.created_at).toDateString();
      return d !== today && d !== yesterday;
    });
    if (todayItems.length) groups.push({ label: 'Today', items: todayItems });
    if (yestItems.length) groups.push({ label: 'Yesterday', items: yestItems });
    if (olderItems.length) groups.push({ label: 'Older', items: olderItems });
    return groups;
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-dark-700 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-96 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 animate-slide-up z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <h3 className="font-display font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-blue hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[420px]">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-slate-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              group(notifications.slice(0, 20)).map(({ label, items }) => (
                <div key={label}>
                  <div className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wider bg-dark-900/50">{label}</div>
                  {items.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id, n.action_url)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left"
                    >
                      <span className="text-lg mt-0.5 flex-shrink-0">{TYPE_ICON[n.type] || '🔔'}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${n.is_read ? 'text-slate-400' : 'text-white font-medium'}`}>{n.title}</p>
                        {n.body && <p className="text-xs text-slate-500 mt-0.5 truncate">{n.body}</p>}
                        <p className="text-xs text-slate-600 mt-1">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-brand-blue flex-shrink-0 mt-1.5" />}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
