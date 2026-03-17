'use client';
import React from 'react';

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[TasksDone Error]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0c0d14', color: '#f0f0ff', padding: 40, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#7b7fa8', fontSize: 14, marginBottom: 24, maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', background: 'linear-gradient(135deg, #7c6fe0, #4a9eff)',
              color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600,
            }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
