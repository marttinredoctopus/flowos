'use client';
import { useEffect, useState } from 'react';
import { HardDrive, Image, FileText, Film, Archive, File, ExternalLink, Trash2 } from 'lucide-react';
import { FileUpload } from '@/components/ui/FileUpload';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType?.startsWith('image/')) return <Image size={28} />;
  if (mimeType?.startsWith('video/')) return <Film size={28} />;
  if (mimeType?.includes('pdf'))      return <FileText size={28} />;
  if (mimeType?.includes('zip'))      return <Archive size={28} />;
  return <File size={28} />;
}

function formatBytes(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesPage() {
  const [files, setFiles]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const r = await apiClient.get('/upload/list');
      setFiles(r.data || []);
    } catch {} finally { setLoading(false); }
  }

  async function deleteFile(key: string) {
    if (!confirm('Delete this file permanently?')) return;
    try {
      await apiClient.delete('/upload', { data: { key } });
      setFiles(prev => prev.filter(f => f.r2_key !== key && f.url !== key));
      toast.success('File deleted');
    } catch { toast.error('Delete failed'); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--indigo-2)' }}>
            <HardDrive size={18} style={{ color: 'var(--indigo)' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Files</h1>
            <p className="text-xs" style={{ color: 'var(--text-2)' }}>
              {files.length} file{files.length !== 1 ? 's' : ''} · Stored in Cloudflare R2
            </p>
          </div>
        </div>
        <FileUpload
          folder="files"
          compact
          label="Upload File"
          onUpload={(uploaded) => {
            setFiles(prev => [{
              id:        Date.now().toString(),
              filename:  uploaded.filename,
              url:       uploaded.url,
              r2_key:    uploaded.key,
              mime_type: uploaded.mimeType,
              size:      uploaded.size,
              created_at: new Date().toISOString(),
            }, ...prev]);
            toast.success('File uploaded to cloud!');
          }}
          onError={err => toast.error(err)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 rounded-xl animate-shimmer" />)}
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed py-20 text-center" style={{ borderColor: 'var(--border)' }}>
          <HardDrive size={40} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>No files yet</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>Upload files to store them in Cloudflare R2 cloud storage</p>
          <FileUpload
            folder="files"
            label="Upload your first file"
            onUpload={(uploaded) => {
              setFiles([{ id: Date.now().toString(), filename: uploaded.filename,
                url: uploaded.url, r2_key: uploaded.key, mime_type: uploaded.mimeType,
                size: uploaded.size, created_at: new Date().toISOString() }]);
              toast.success('File uploaded to cloud!');
            }}
            onError={err => toast.error(err)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((f: any) => (
            <div key={f.id || f.r2_key} className="group rounded-xl overflow-hidden transition"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <a href={f.url} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 text-center">
                <div style={{ color: 'var(--text-3)' }}><FileIcon mimeType={f.mime_type} /></div>
                <p className="text-xs font-medium truncate w-full" style={{ color: 'var(--text)' }}>{f.filename}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>{formatBytes(f.size || f.size_bytes)}</p>
              </a>
              <div className="flex border-t gap-px" style={{ borderColor: 'var(--border)' }}>
                <a href={f.url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center h-8 transition hover:opacity-70"
                  style={{ color: 'var(--text-2)' }}>
                  <ExternalLink size={12} />
                </a>
                {f.r2_key && (
                  <button onClick={() => deleteFile(f.r2_key)}
                    className="flex-1 flex items-center justify-center h-8 transition hover:opacity-70"
                    style={{ color: 'var(--rose)' }}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
