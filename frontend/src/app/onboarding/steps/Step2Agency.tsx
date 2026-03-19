'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/context/onboardingContext';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  agencyName: z.string().min(1, 'Agency name is required').max(80, 'Max 80 characters'),
  industry: z.string().optional(),
  teamSize: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputSt: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 10,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f2f9', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const labelSt: React.CSSProperties = {
  display: 'block', fontSize: 13, color: '#8b949e', marginBottom: 8, fontWeight: 500,
};
const errorSt: React.CSSProperties = {
  fontSize: 12, color: '#f87171', marginTop: 5,
};
const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  width: '100%', padding: '13px 24px', borderRadius: 11,
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
  boxShadow: '0 0 24px rgba(99,102,241,0.35)', transition: 'opacity 0.15s',
};
const btnGhost: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '12px 20px', borderRadius: 10, background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)', color: '#8b949e',
  fontSize: 14, cursor: 'pointer',
};

const TEAM_SIZES = ['1-5', '5-10', '10+'];
const INDUSTRIES = [
  'Marketing Agency', 'Creative Agency', 'Media Buying', 'Freelancer',
  'E-commerce', 'SaaS / Tech', 'Real Estate', 'Healthcare', 'Other',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step2Agency() {
  const { state, setStepData, nextStep, prevStep } = useOnboarding();
  const { agency } = state;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      agencyName: agency.agencyName,
      industry: agency.industry,
      teamSize: agency.teamSize,
    },
  });

  const teamSize = watch('teamSize');

  // Pre-fill if context already has data (e.g. user went back)
  useEffect(() => {
    if (agency.agencyName) setValue('agencyName', agency.agencyName, { shouldValidate: true });
    if (agency.industry) setValue('industry', agency.industry);
    if (agency.teamSize) setValue('teamSize', agency.teamSize);
  }, []);

  function onSubmit(data: FormData) {
    setStepData('agency', {
      agencyName: data.agencyName,
      industry: data.industry || '',
      teamSize: data.teamSize || '',
    });
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>

        {/* Agency name */}
        <div>
          <label style={labelSt}>Agency name *</label>
          <input
            {...register('agencyName')}
            placeholder="e.g. Creative Studio Co."
            autoFocus
            style={{
              ...inputSt,
              borderColor: errors.agencyName ? '#f87171' : 'rgba(255,255,255,0.08)',
            }}
            onFocus={e => { if (!errors.agencyName) (e.target as HTMLInputElement).style.borderColor = '#6366f1'; }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.agencyName ? '#f87171' : 'rgba(255,255,255,0.08)'; }}
          />
          {errors.agencyName && <p style={errorSt}>{errors.agencyName.message}</p>}
        </div>

        {/* Industry */}
        <div>
          <label style={labelSt}>Industry</label>
          <select
            {...register('industry')}
            style={{ ...inputSt, appearance: 'none' as any }}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        {/* Team size */}
        <div>
          <label style={labelSt}>Team size</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {TEAM_SIZES.map(sz => (
              <button
                key={sz}
                type="button"
                onClick={() => setValue('teamSize', sz, { shouldValidate: true })}
                style={{
                  padding: '11px 8px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  background: teamSize === sz ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${teamSize === sz ? '#6366f1' : 'rgba(255,255,255,0.07)'}`,
                  color: teamSize === sz ? '#a5b4fc' : '#8b949e',
                  transition: 'all 0.15s',
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={prevStep} style={btnGhost}>
          <ArrowLeft size={15} />
        </button>
        <button
          type="submit"
          disabled={!isValid}
          style={{ ...btnPrimary, flex: 1, opacity: isValid ? 1 : 0.45, cursor: isValid ? 'pointer' : 'not-allowed' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
