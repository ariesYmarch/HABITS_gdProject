import { StateCreator } from 'zustand';
import { Occupation } from '../../types/user';

export interface UserSlice {
  userName: string;
  userIcon: string;
  personalityTypeId: number | null;
  idealPersonalityTypeId: number | null;
  occupation: Occupation;
  selectedHashtags: string[];
  hasCompletedOnboarding: boolean;

  setUserName: (name: string) => void;
  setUserIcon: (icon: string) => void;
  setPersonalityTypeId: (id: number) => void;
  setIdealPersonalityTypeId: (id: number) => void;
  setOccupation: (occupation: Occupation) => void;
  setSelectedHashtags: (tags: string[]) => void;
  completeOnboarding: () => void;
  resetUser: () => void;
}

const initialUserState = {
  userName: '',
  userIcon: '😀',
  personalityTypeId: null as number | null,
  idealPersonalityTypeId: null as number | null,
  occupation: '학생' as Occupation,
  selectedHashtags: [] as string[],
  hasCompletedOnboarding: false,
};

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  ...initialUserState,

  setUserName: (name) => set({ userName: name }),
  setUserIcon: (icon) => set({ userIcon: icon }),
  setPersonalityTypeId: (id) => set({ personalityTypeId: id }),
  setIdealPersonalityTypeId: (id) => set({ idealPersonalityTypeId: id }),
  setOccupation: (occupation) => set({ occupation }),
  setSelectedHashtags: (tags) => set({ selectedHashtags: tags }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  resetUser: () => set(initialUserState),
});
