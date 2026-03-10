'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function ChatPage() {
  const { user, accessToken } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken) return;
    const s = io(SOCKET_URL, { auth: { token: accessToken } });
    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('chat:message', (msg: any) => setMessages(prev => [...prev, msg]));
    setSocket(s);
    return () => { s.disconnect(); };
  }, [accessToken]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    socket.emit('chat:message', { content: input.trim(), channel: 'general' });
    setInput('');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div>
          <h1 className="font-display text-lg font-bold text-white"># general</h1>
          <p className="text-xs text-slate-500">Team chat</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-slate-500'}`} />
          <span className="text-xs text-slate-500">{connected ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.userId === user?.id || msg.user_id === user?.id;
          return (
            <div key={i} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${isMe ? 'gradient-bg' : 'bg-white/10'}`}>
                {(msg.userName || msg.user_name || '?')[0]?.toUpperCase()}
              </div>
              <div className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMe && <span className="text-xs text-slate-500 px-1">{msg.userName || msg.user_name}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'gradient-bg text-white rounded-br-sm' : 'bg-white/5 text-slate-200 rounded-bl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-4 border-t border-white/5 flex gap-3">
        <input
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50 transition"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" disabled={!input.trim()} className="px-5 py-2.5 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-40">Send</button>
      </form>
    </div>
  );
}
