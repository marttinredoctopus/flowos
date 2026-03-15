'use client';
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface Doc { id: string; title: string; icon: string; updated_at: string; parent_id: string | null; content?: any; is_favorite?: boolean }

const ICONS = ['📝','📄','📋','📌','🗒️','💼','🌟','🔖','📚','💡','🎯','🚀','⚡','🔑','🎨'];

const BLOCK_TYPES = [
  { type: 'heading1', label: 'Heading 1', icon: 'H1' },
  { type: 'heading2', label: 'Heading 2', icon: 'H2' },
  { type: 'paragraph', label: 'Text', icon: '¶' },
  { type: 'bulletList', label: 'Bullet List', icon: '•' },
  { type: 'numberedList', label: 'Numbered List', icon: '1.' },
  { type: 'checklist', label: 'Checklist', icon: '☑' },
  { type: 'quote', label: 'Quote', icon: '"' },
  { type: 'code', label: 'Code Block', icon: '</>' },
  { type: 'divider', label: 'Divider', icon: '—' },
  { type: 'callout', label: 'Callout', icon: '💡' },
];

export default function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showSlash, setShowSlash] = useState(false);
  const [search, setSearch] = useState('');
  const [slashQuery, setSlashQuery] = useState('');

  useEffect(() => { loadDocs(); }, []);

  async function loadDocs() {
    try {
      const r = await apiClient.get('/docs');
      setDocs(r.data);
    } catch {} finally { setLoading(false); }
  }

  async function createDoc(parentId?: string) {
    try {
      const r = await apiClient.post('/docs', { title: 'Untitled', icon: '📝', parentId });
      setDocs(prev => [r.data, ...prev]);
      openDoc(r.data);
    } catch { toast.error('Failed to create doc'); }
  }

  function openDoc(doc: Doc) {
    setActiveDoc(doc);
    setTitle(doc.title);
    setContent(doc.content ? (typeof doc.content === 'string' ? doc.content : JSON.stringify(doc.content, null, 2)) : '');
  }

  const saveDoc = useCallback(async () => {
    if (!activeDoc) return;
    setSaving(true);
    try {
      await apiClient.patch(`/docs/${activeDoc.id}`, { title, content: { text: content } });
      setDocs(prev => prev.map(d => d.id === activeDoc.id ? { ...d, title } : d));
    } catch {} finally { setSaving(false); }
  }, [activeDoc, title, content]);

  // Auto-save debounced
  useEffect(() => {
    if (!activeDoc) return;
    const t = setTimeout(saveDoc, 2000);
    return () => clearTimeout(t);
  }, [title, content, saveDoc, activeDoc]);

  async function toggleFavorite(doc: Doc) {
    try {
      await apiClient.patch(`/docs/${doc.id}`, { is_favorite: !doc.is_favorite });
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, is_favorite: !d.is_favorite } : d));
    } catch {}
  }

  async function archiveDoc(doc: Doc) {
    if (!confirm(`Archive "${doc.title}"?`)) return;
    try {
      await apiClient.post(`/docs/${doc.id}/archive`);
      setDocs(prev => prev.filter(d => d.id !== doc.id));
      if (activeDoc?.id === doc.id) setActiveDoc(null);
      toast.success('Archived');
    } catch { toast.error('Failed'); }
  }

  function handleContentKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === '/') {
      const textarea = e.target as HTMLTextAreaElement;
      const lastNewline = textarea.value.lastIndexOf('\n', textarea.selectionStart - 1);
      const lineStart = textarea.value.slice(lastNewline + 1, textarea.selectionStart);
      if (lineStart.trim() === '') { setShowSlash(true); setSlashQuery(''); }
    } else if (e.key === 'Escape') {
      setShowSlash(false);
    } else if (showSlash) {
      if (e.key === 'Backspace') setSlashQuery(q => q.slice(0, -1));
      else if (e.key.length === 1) setSlashQuery(q => q + e.key);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target as HTMLTextAreaElement;
      const start = el.selectionStart;
      const newContent = content.slice(0, start) + '  ' + content.slice(el.selectionEnd);
      setContent(newContent);
      setTimeout(() => el.setSelectionRange(start + 2, start + 2), 0);
    }
  }

  function insertBlock(type: string) {
    const map: Record<string, string> = {
      heading1: '\n# ', heading2: '\n## ', paragraph: '\n',
      bulletList: '\n- ', numberedList: '\n1. ', checklist: '\n- [ ] ',
      quote: '\n> ', code: '\n```\n\n```', divider: '\n---\n', callout: '\n> 💡 ',
    };
    setContent(c => c + (map[type] || '\n'));
    setShowSlash(false);
  }

  const filteredDocs = docs.filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()));
  const filteredBlocks = showSlash ? BLOCK_TYPES.filter(b => b.label.toLowerCase().includes(slashQuery.toLowerCase())) : [];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0c0d11]">
        <div className="p-3 border-b border-white/5 space-y-2">
          <button onClick={() => createDoc()} className="w-full py-2 gradient-bg rounded-xl text-xs font-semibold text-white hover:opacity-90">
            + New Page
          </button>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            placeholder="Search docs…" />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-1">{[1,2,3].map(i => <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />)}</div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-xs">No pages yet</p>
              <button onClick={() => createDoc()} className="mt-2 text-xs text-brand-blue hover:underline">Create one →</button>
            </div>
          ) : (
            filteredDocs.map(doc => (
              <div key={doc.id} className="group flex items-center gap-1.5 mb-0.5">
                <button onClick={() => openDoc(doc)}
                  className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition text-left ${activeDoc?.id === doc.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <span>{doc.icon}</span>
                  <span className="flex-1 truncate">{doc.title}</span>
                  {doc.is_favorite && <span className="text-yellow-400">⭐</span>}
                </button>
                <div className="hidden group-hover:flex gap-0.5">
                  <button onClick={() => toggleFavorite(doc)} className="p-1 text-slate-600 hover:text-yellow-400 transition text-xs">⭐</button>
                  <button onClick={() => archiveDoc(doc)} className="p-1 text-slate-600 hover:text-red-400 transition text-xs">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      {activeDoc ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl cursor-pointer">{activeDoc.icon}</span>
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="text-xl font-display font-bold text-white bg-transparent border-none outline-none"
                placeholder="Untitled" />
            </div>
            <div className="flex items-center gap-2">
              {saving && <span className="text-xs text-slate-500">Saving…</span>}
              <button onClick={saveDoc} className="px-3 py-1.5 gradient-bg rounded-lg text-xs font-semibold text-white hover:opacity-90">Save</button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); if (!e.target.value.includes('/')) setShowSlash(false); }}
              onKeyDown={handleContentKeyDown}
              className="w-full h-full px-16 py-8 bg-transparent text-slate-200 text-sm leading-relaxed font-mono resize-none focus:outline-none"
              placeholder="Start writing… type / for commands

# Heading 1
## Heading 2
- Bullet list
- [ ] Checkbox
> Quote
```
code block
```
---
> 💡 Callout"
            />

            {/* Slash command palette */}
            {showSlash && filteredBlocks.length > 0 && (
              <div className="absolute bottom-20 left-16 bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 w-56">
                {filteredBlocks.map((b, i) => (
                  <button key={b.type} onClick={() => insertBlock(b.type)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition">
                    <span className="w-6 text-center text-xs font-mono text-slate-500">{b.icon}</span>
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-white font-display font-bold text-xl mb-2">Docs & Wiki</h2>
            <p className="text-slate-400 text-sm mb-6">Create and organize your team's knowledge base</p>
            <button onClick={() => createDoc()} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white hover:opacity-90">
              + Create First Page
            </button>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto text-xs text-slate-500">
              <div className="p-3 bg-white/5 rounded-xl">📋 Meeting Notes</div>
              <div className="p-3 bg-white/5 rounded-xl">🎯 Project Brief</div>
              <div className="p-3 bg-white/5 rounded-xl">📊 Reports</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
