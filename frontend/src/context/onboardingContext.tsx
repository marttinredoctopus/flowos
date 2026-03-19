'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Step data types ──────────────────────────────────────────────────────────

export interface AgencyData {
  agencyName: string;
  industry: string;
  teamSize: string;
}

export interface ClientData {
  clientName: string;
  clientIndustry: string;
  notes: string;
  clientId: string; // set after API call
}

export interface ProjectData {
  projectName: string;
  deadline: string;
  projectId: string; // set after API call
}

export interface TaskData {
  taskName: string;
  dueDate: string;
}

export interface OnboardingState {
  step: number;
  agency: AgencyData;
  client: ClientData;
  project: ProjectData;
  task: TaskData;
}

// ─── Context value type ───────────────────────────────────────────────────────

interface OnboardingContextValue {
  state: OnboardingState;
  setStepData: <K extends keyof Omit<OnboardingState, 'step'>>(
    section: K,
    data: Partial<OnboardingState[K]>
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_STATE: OnboardingState = {
  step: 1,
  agency: { agencyName: '', industry: '', teamSize: '' },
  client: { clientName: '', clientIndustry: '', notes: '', clientId: '' },
  project: { projectName: '', deadline: '', projectId: '' },
  task: { taskName: '', dueDate: '' },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);

  const setStepData = useCallback(
    <K extends keyof Omit<OnboardingState, 'step'>>(
      section: K,
      data: Partial<OnboardingState[K]>
    ) => {
      setState(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));
    },
    []
  );

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return (
    <OnboardingContext.Provider value={{ state, setStepData, nextStep, prevStep, goToStep, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  return ctx;
}
