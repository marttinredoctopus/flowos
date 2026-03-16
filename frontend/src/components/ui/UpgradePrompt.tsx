'use client';
import { useRouter } from 'next/navigation';

interface UpgradePromptProps {
  feature?: string;
  requiredPlan?: 'pro' | 'enterprise';
  onDismiss?: () => void;
}

export function UpgradePrompt({ feature, requiredPlan = 'pro', onDismiss }: UpgradePromptProps) {
  const router = useRouter();
  const planColor = requiredPlan === 'enterprise' ? '#7c6fe0' : '#4a9eff';
  const planName = requiredPlan === 'enterprise' ? 'Enterprise' : 'Pro';

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(124,111,224,0.08), rgba(74,158,255,0.08))',
      border: '1px solid rgba(124,111,224,0.3)',
      borderRadius: 16,
      padding: 32,
      textAlign: 'center',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        Upgrade to {planName}
      </h3>
      <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.6, marginBottom: 24 }}>
        {feature
          ? `${feature} requires the ${planName} plan.`
          : `You've reached the limit of your current plan.`}{' '}
        Upgrade to unlock more capacity and features.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button
          onClick={() => router.push('/dashboard/settings?tab=billing')}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: `linear-gradient(135deg, ${planColor}, #7c6fe0)`,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
          View Plans →
        </button>
        {onDismiss && (
          <button onClick={onDismiss} style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: '#8b949e',
            fontSize: 14,
            cursor: 'pointer',
          }}>
            Maybe later
          </button>
        )}
      </div>
    </div>
  );
}
