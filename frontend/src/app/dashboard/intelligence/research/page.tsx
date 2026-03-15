'use client';
import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface Message { role: 'user' | 'assistant'; content: string }
interface Conversation { id: string; title: string; updated_at: string }

export default function MarketResearchPage() {
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

  function selectConversation(conv: Conversation) {
    setActiveConvId(conv.id);
    setMessages([]);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
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
      const token = (window as any).__FLOWOS_AUTH_TOKEN__;
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
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
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
      }
      await loadConversations();
    } catch (err: any) {
      toast.error('Failed to get response');
      setMessages(prev => prev.filter(m => !(m.role === 'assistant' && m.content === '')));
    } finally { setLoading(false); setStreaming(false); }
  }

  function renderMessage(content: string) {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-bold text-white mt-3 mb-1">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-base font-semibold text-white mt-2 mb-1">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-slate-200 mt-2 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} className="ml-4 text-slate-300 text-sm">{line.slice(2)}</li>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-white text-sm">{line.slice(2, -2)}</p>;
      if (line === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
    });
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0c0d11]">
        <div className="p-3 border-b border-white/5">
          <button onClick={newConversation} className="w-full py-2 gradient-bg rounded-xl text-xs font-semibold text-white hover:opacity-90 transition">
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map(c => (
            <button key={c.id} onClick={() => selectConversation(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition mb-0.5 ${activeConvId === c.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <p className="truncate font-medium">{c.title}</p>
              <p className="text-slate-600 text-[10px] mt-0.5">{new Date(c.updated_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h1 className="font-display text-lg font-bold text-white">Market Research Assistant</h1>
          <p className="text-slate-400 text-xs mt-0.5">Ask anything about markets, trends, strategies, and competitor insights</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-5xl mb-4">🧠</div>
              <p className="text-white font-semibold mb-2">Marketing Strategy Assistant</p>
              <p className="text-slate-400 text-sm max-w-md">Ask me about market sizing, competitor strategies, content ideas, campaign concepts, or any marketing challenge.</p>
              <div className="mt-6 grid grid-cols-2 gap-2 max-w-md">
                {[
                  "What's the market size for influencer marketing in MENA?",
                  "How do top agencies position their content services?",
                  "Give me 10 Instagram content ideas for a fashion brand",
                  "What KPIs should I track for a brand awareness campaign?",
                ].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left text-xs text-slate-400 hover:text-white transition">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 ${m.role === 'user' ? 'gradient-bg text-white' : 'bg-[#0f1117] border border-white/5'}`}>
                {m.role === 'assistant' ? (
                  <div>{renderMessage(m.content)}{streaming && i === messages.length - 1 && m.content === '' && (
                    <span className="inline-flex gap-1 mt-1">
                      {[0,1,2].map(d => <span key={d} className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{animationDelay:`${d*0.15}s`}} />)}
                    </span>
                  )}</div>
                ) : (
                  <p className="text-sm">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-white/5">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} disabled={loading}
              className="flex-1 px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/50"
              placeholder="Ask about markets, strategies, competitors…" />
            <button type="submit" disabled={loading || !input.trim()}
              className="px-5 py-3 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
              {loading ? '⏳' : '→'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
