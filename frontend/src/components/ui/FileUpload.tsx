'use client';
import { useState, useRef, DragEvent } from 'react';
import { Upload, File, Image, FileText, Loader2 } from 'lucide-react';

export interface UploadedFile {
  url:      string;
  key:      string;
  filename: string;
  size:     number;
  mimeType: string;
  mime_type?: string;
}

interface FileUploadProps {
  folder?:      string;
  entityType?:  string;
  entityId?:    string;
  accept?:      string;
  maxFiles?:    number;
  onUpload:     (file: UploadedFile) => void;
  onError?:     (error: string) => void;
  label?:       string;
  compact?:     boolean;
}

export function FileUpload({
  folder      = 'files',
  entityType,
  entityId,
  accept      = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.ai,.psd,.svg',
  maxFiles    = 10,
  onUpload,
  onError,
  label       = 'Upload files',
  compact     = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [progress, setProgress]   = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (entityType) formData.append('entity_type', entityType);
    if (entityId)   formData.append('entity_id', entityId);

    try {
      const token   = (window as any).__TASKSDONE_AUTH_TOKEN__ || '';
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '');

      const result = await new Promise<UploadedFile>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiBase}/api/upload/single`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data.url) {
              resolve({
                url:      data.url,
                key:      data.key || '',
                filename: data.filename,
                size:     data.size,
                mimeType: data.mime_type || file.type,
              });
            } else {
              reject(new Error(data.error || 'Upload failed'));
            }
          } catch {
            reject(new Error('Invalid server response'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      onUpload(result);
    } catch (err: any) {
      const msg = err.message || 'Upload failed';
      onError?.(msg);
      import('react-hot-toast').then(({ default: toast }) => toast.error(msg));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleFiles(files: FileList | File[]) {
    for (const f of Array.from(files).slice(0, maxFiles)) await uploadFile(f);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  if (compact) {
    return (
      <>
        <input ref={inputRef} type="file" accept={accept} multiple={maxFiles > 1}
          className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition disabled:opacity-50"
          style={{ background: 'var(--card)', border: '1px solid var(--border-hover)', color: 'var(--text-2)' }}
        >
          {uploading
            ? <><Loader2 size={12} className="animate-spin" /> {progress}%</>
            : <><Upload size={12} /> {label}</>}
        </button>
      </>
    );
  }

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} multiple={maxFiles > 1}
        className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className="rounded-xl text-center transition-all"
        style={{
          border:     `2px dashed ${dragOver || uploading ? 'var(--indigo)' : 'var(--border-hover)'}`,
          padding:    '28px 20px',
          background: dragOver ? 'var(--indigo-2)' : 'var(--input-bg)',
          cursor:     uploading ? 'not-allowed' : 'pointer',
        }}
      >
        {uploading ? (
          <div>
            <Loader2 size={28} className="mx-auto mb-2 animate-spin" style={{ color: 'var(--indigo)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--text-2)' }}>Uploading to cloud… {progress}%</p>
            <div className="h-1.5 rounded-full mx-auto max-w-xs" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all duration-200"
                style={{ width: `${progress}%`, background: 'var(--grad-primary)' }} />
            </div>
          </div>
        ) : (
          <>
            <Upload size={28} className="mx-auto mb-2"
              style={{ color: dragOver ? 'var(--indigo)' : 'var(--text-3)' }} />
            <p className="text-sm font-medium" style={{ color: dragOver ? 'var(--indigo)' : 'var(--text-2)' }}>
              {dragOver ? 'Drop to upload' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
              PNG, JPG, PDF, SVG, AI, PSD — max {maxFiles} file{maxFiles !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default FileUpload;
