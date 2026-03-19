'use client';
import { OnboardingProvider } from '@/context/onboardingContext';
import OnboardingFlow from './OnboardingFlow';

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  );
}
