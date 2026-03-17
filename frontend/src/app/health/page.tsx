'use client';
import { useEffect, useState } from 'react';

export default function HealthPage() {
  const [apiStatus, setApiStatus] = useState('checking...');
  const [apiData, setApiData] = useState<string>('');

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') + '/health'
      : 'http://localhost:3001/health';
    fetch(url)
      .then(r => r.json())
      .then(d => { setApiStatus('✅ Connected'); setApiData(JSON.stringify(d)); })
      .catch(err => setApiStatus('❌ ' + err.message));
  }, []);

  return (
    <div style={{ padding: 40, background: '#08090d', minHeight: '100vh', color: '#fff', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>TasksDone Health Check</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {[
            ['Frontend', '✅ Running'],
            ['NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL || '⚠️ NOT SET (using localhost fallback)'],
            ['NEXT_PUBLIC_SOCKET_URL', process.env.NEXT_PUBLIC_SOCKET_URL || '⚠️ NOT SET'],
            ['Backend API', apiStatus],
            ['API Response', apiData || '—'],
          ].map(([k, v]) => (
            <tr key={k} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '12px 0', color: '#888', width: 260 }}>{k}</td>
              <td style={{ padding: '12px 0', color: '#fff' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
