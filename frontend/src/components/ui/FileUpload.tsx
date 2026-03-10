'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { uploadApi } from '@/lib/api';
import type { UploadedFile } from '@/types/content';
import toast from 'react-hot-toast';

interface FileUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export default function FileUpload({ value, onChange, maxFiles = 5 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        toast.error(`Max ${maxFiles} files allowed`);
        return;
      }

      setUploading(true);
      try {
        const results = await uploadApi.multiple(acceptedFiles);
        const newUrls = results.map((f) => f.url);
        setUploadedFiles((prev) => [...prev, ...results]);
        onChange([...value, ...newUrls]);
        toast.success(`${results.length} file(s) uploaded`);
      } catch {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, maxFiles]
  );

  const removeFile = async (url: string, index: number) => {
    const file = uploadedFiles[index];
    if (file) {
      try {
        await uploadApi.delete(file.filename);
      } catch {
        // ignore — still remove from UI
      }
    }
    const next = value.filter((_, i) => i !== index);
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    onChange(next);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxFiles: maxFiles - value.length,
    disabled: uploading || value.length >= maxFiles,
  });

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'}
          ${uploading || value.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {uploading ? (
            <p className="text-sm text-gray-500">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-primary-600 font-medium">Drop files here</p>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drag & drop or <span className="text-primary-600">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Images & videos — max {maxFiles} files</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={url} alt={`media ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeFile(url, i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
