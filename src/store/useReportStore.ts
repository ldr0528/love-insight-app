
import { create } from 'zustand';

export type RelationshipStage = 'single' | 'dating' | 'relationship' | 'breakup_recovery';
export type Goal = 'improve_attraction' | 'stabilize_relationship' | 'improve_communication' | 'move_on' | 'other';
export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string; // Added name for personalization
  gender: Gender;
  birthday: string;
  birthTime: string; // HH:mm
  birthLocation: string;
  relationship_stage: RelationshipStage;
  goal: Goal;
}

export interface PalmFeatures {
  heart_line: string;
  head_line: string;
  life_line: string;
  mount_venus: string;
}

export interface ReportState {
  // Data
  profile: UserProfile;
  mbti: string;
  palm: PalmFeatures;
  
  // UI State
  currentStep: number;
  totalSteps: number;
  
  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  setMBTI: (mbti: string) => void;
  setPalmFeatures: (features: Partial<PalmFeatures>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  profile: {
    name: '',
    gender: 'female',
    birthday: '2000-01-01',
    birthTime: '12:00',
    birthLocation: '上海',
    relationship_stage: 'single',
    goal: 'improve_attraction',
  },
  mbti: '',
  palm: {
    heart_line: 'unknown',
    head_line: 'unknown',
    life_line: 'unknown',
    mount_venus: 'unknown',
  },
  
  currentStep: 0,
  totalSteps: 2, // 0:BasicInfo -> 1:Generating/Result (Independent Flow)

  setProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),
  setMBTI: (mbti) => set({ mbti }),
  setPalmFeatures: (features) => set((state) => ({ palm: { ...state.palm, ...features } })),
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  reset: () => set({
    currentStep: 0,
    profile: {
      name: '',
      gender: 'female',
      birthday: '2000-01-01',
      birthTime: '12:00',
      birthLocation: '上海',
      relationship_stage: 'single',
      goal: 'improve_attraction',
    },
    mbti: '',
    palm: { heart_line: 'unknown', head_line: 'unknown', life_line: 'unknown', mount_venus: 'unknown' }
  }),
}));
