'use client';
import { useEffect, useState, useRef } from 'react';
import apiClient from '@/lib/apiClient';

function fileIcon(type: string) {
  if (type?.includes('image')) return '🖼️';
  if (type?.includes('video')) return '🎬';
  if (type?.includes('pdf')) return '📄';
  if (type?.includes('zip')) return '🗜️';
  return '📎';
}
function fileSize(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1048576).toFixed(1)} MB`;
}

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    try { const r = await apiClient.get('/upload/list'); setFiles(r.data || []); }
    catch {} finally { setLoading(false); }
  }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      await apiClient.post('/upload/single', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      load();
    } catch {} finally { setUploading(false); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-2xl font-bold text-white">Files</h1><p className="text-slate-400 text-sm mt-1">{files.length} files</p></div>
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="px-4 py-2 gradient-bg rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
          {uploading ? 'Uploading...' : '↑ Upload File'}
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={upload} />
      </div>

      {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      : files.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-5xl mb-4">🗂️</div>
          <p className="text-slate-400 mb-4">No files uploaded yet</p>
          <button onClick={() => inputRef.current?.click()} className="px-6 py-3 gradient-bg rounded-xl font-semibold text-white">Upload File</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {files.map((f: any) => (
            <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="bg-[#0f1117] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition flex flex-col items-center text-center gap-2">
              <div className="text-3xl">{fileIcon(f.mime_type)}</div>
              <p className="text-xs text-white font-medium truncate w-full">{f.filename}</p>
              <p className="text-[10px] text-slate-500">{fileSize(f.size)}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
