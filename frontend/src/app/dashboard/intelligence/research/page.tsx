'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Send, Bot, Trash2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';

interface Message { role: 'user' | 'assistant'; content: string }
interface Conversation { id: string; title: string; updated_at: string }

const STARTER_PROMPTS = [
  "What's the market size for influencer marketing in MENA?",
  "How do top agencies position their content services?",
  "Give me 10 Instagram content ideas for a fashion brand",
  "What KPIs should I track for a brand awareness campaign?",
];

export default function MarketResearchPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function loadConversations() {
    try {
      const r = await apiClient.get('/intelligence/conversations');
      setConversations(r.data);
    } catch {}
  }

  async function newConversation() {
    try {
      const r = await apiClient.post('/intelligence/conversations', { title: 'New Conversation' });
      setConversations(prev => [r.data, ...prev]);
      setActiveConvId(r.data.id);
      setMessages([]);
    } catch { toast.error('Failed to create conversation'); }
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await apiClient.delete(`/intelligence/conversations/${id}`);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConvId === id) { setActiveConvId(null); setMessages([]); }
    } catch { toast.error('Failed to delete'); }
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    let convId = activeConvId;
    if (!convId) {
      try {
        const r = await apiClient.post('/intelligence/conversations', {});
        convId = r.data.id;
        setActiveConvId(convId);
        setConversations(prev => [r.data, ...prev]);
      } catch { toast.error('Failed to start conversation'); return; }
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true); setStreaming(true);

    try {
      const token = (window as any).__TASKSDONE_AUTH_TOKEN__;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/intelligence/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ conversationId: convId, message: userMessage }),
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantText += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantText };
                return updated;
              });
            }
          } catch {}
        }
      }
      await loadConversations();
    } catch {
      toast.error('Failed to get response');
      setMessages(prev => prev.filter(m => !(m.role === 'assistant' && m.content === '')));
    } finally { setLoading(false); setStreaming(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function renderMessage(content: string) {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# '))  return <h1 key={i} className="text-base font-bold mt-3 mb-1" style={{ color: 'var(--text)' }}>{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-sm font-semibold mt-2 mb-1" style={{ color: 'var(--text)' }}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-medium mt-2 mb-0.5" style={{ color: 'var(--text)' }}>{line.slice(4)}</h3>;
      if (line.startsWith('- ') || line.startsWith('• '))
        return <li key={i} className="ml-4 text-sm" style={{ color: 'var(--text-2)' }}>{line.slice(2)}</li>;
      if (line === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{line}</p>;
    });
  }

  return (
    <div className="flex h-full">
      {/* Conversations sidebar */}
      <div className="w-56 flex-shrink-0 flex flex-col" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={newConversation}
            className="w-full h-8 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--grad-primary)' }}>
            <Plus size={12} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 && (
            <p className="text-xs text-center mt-4 px-2" style={{ color: 'var(--text-3)' }}>No conversations yet</p>
          )}
          {conversations.map(c => (
            <button key={c.id} onClick={() => { setActiveConvId(c.id); setMessages([]); }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs transition mb-0.5 group flex items-start justify-between"
              style={{
                background: activeConvId === c.id ? 'var(--indigo-2)' : 'transparent',
                color: activeConvId === c.id ? 'var(--indigo)' : 'var(--text-2)',
              }}>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{c.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{new Date(c.updated_at).toLocaleDateString()}</p>
              </div>
              <button onClick={e => deleteConversation(c.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition flex-shrink-0 ml-1"
                style={{ color: 'var(--rose)' }}>
                <Trash2 size={11} />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h1 className="font-bold text-base" style={{ color: 'var(--text)' }}>Market Research Assistant</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>Ask anything about markets, trends, strategies, and competitor insights</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--indigo-2)' }}>
                <Bot size={26} style={{ color: 'var(--indigo)' }} />
              </div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Marketing Strategy Assistant</p>
              <p className="text-sm max-w-md" style={{ color: 'var(--text-2)' }}>Ask me about market sizing, competitor strategies, content ideas, campaign concepts, or any marketing challenge.</p>
              <div className="mt-6 grid grid-cols-2 gap-2 max-w-md">
                {STARTER_PROMPTS.map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    className="p-3 rounded-xl text-left text-xs transition hover:opacity-80"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'var(--indigo-2)' }}>
                  <Bot size={14} style={{ color: 'var(--indigo)' }} />
                </div>
              )}
              <div
                className="max-w-[78%] rounded-2xl px-4 py-3"
                style={m.role === 'user'
                  ? { background: 'var(--grad-primary)' }
                  : { background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {m.role === 'assistant' ? (
                  <div>
                    {renderMessage(m.content)}
                    {streaming && i === messages.length - 1 && m.content === '' && (
                      <span className="inline-flex gap-1 mt-1">
                        {[0,1,2].map(d => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{ background: 'var(--indigo)', animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-white">{m.content}</p>
                )}
              </div>
              {m.role === 'user' && <Avatar name={user?.name || '?'} size={28} className="flex-shrink-0 mt-1" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex gap-2 items-end rounded-xl p-2" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              className="flex-1 bg-transparent text-sm outline-none resize-none"
              style={{ color: 'var(--text)', maxHeight: '120px' }}
              placeholder="Ask about markets, strategies, competitors… (Enter to send)"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--grad-primary)', color: '#fff' }}
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send size={14} />}
            </button>
          </div>
          <p className="text-[10px] text-center mt-1" style={{ color: 'var(--text-3)' }}>Shift+Enter for new line · Enter to send</p>
        </div>
      </div>
    </div>
  );
}
