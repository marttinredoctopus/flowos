'use client';
import { useEffect, useState } from 'react';
import { HardDrive } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface StorageData {
  used_bytes:      number;
  limit_bytes:     number;
  used_formatted:  string;
  limit_formatted: string;
  percentage:      number;
  is_near_full:    boolean;
  is_full:         boolean;
}

export default function StorageBar() {
  const [storage, setStorage] = useState<StorageData | null>(null);

  useEffect(() => {
    apiClient.get('/upload/usage')
      .then(r => setStorage(r.data))
      .catch(() => {});
  }, []);

  if (!storage) return null;

  const pct   = storage.percentage || 0;
  const color = pct >= 90 ? 'var(--rose)' : pct >= 70 ? 'var(--amber)' : 'var(--indigo)';

  return (
    <div className="px-3 py-2.5" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <HardDrive size={11} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
        <span className="text-[11px] flex-1" style={{ color: 'var(--text-3)' }}>Storage</span>
        <span className="text-[10px] font-semibold" style={{ color: pct >= 80 ? color : 'var(--text-3)' }}>
          {storage.used_formatted} / {storage.limit_formatted}
        </span>
      </div>
      <div className="h-1 rounded-full" style={{ background: 'var(--border-hover)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
      {pct >= 80 && (
        <a href="/dashboard/settings" className="text-[10px] mt-1 block hover:underline"
          style={{ color: 'var(--amber)' }}>
          ⚠ Upgrade for more storage →
        </a>
      )}
    </div>
  );
}
