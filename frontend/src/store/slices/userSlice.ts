import { StateCreator } from 'zustand';
import { Occupation } from '../../types/user';

// 성격 검사 결과 + sync 메타데이터 (백엔드 PersonalityResult 테이블과 1:1)
export interface PersonalityMeta {
  clientId: string;          // sync 시 PersonalityResult.client_id
  typeId: number;
  hashtags: string[];
  testedAt: string;          // ISO
  updatedAt: string;         // ISO
}

export interface UserSlice {
  userName: string;
  userIcon: string;
  personalityTypeId: number | null;
  idealPersonalityTypeId: number | null;
  // 검사 결과 sync용 메타. setPersonalityTypeId 시점에 자동 생성됨.
  personalityCurrent: PersonalityMeta | null;
  personalityIdeal: PersonalityMeta | null;
  occupation: Occupation;
  selectedHashtags: string[];
  hasCompletedOnboarding: boolean;

  setUserName: (name: string) => void;
  setUserIcon: (icon: string) => void;
  setPersonalityTypeId: (id: number, hashtags: string[]) => void;
  setIdealPersonalityTypeId: (id: number, hashtags: string[]) => void;
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
  personalityCurrent: null as PersonalityMeta | null,
  personalityIdeal: null as PersonalityMeta | null,
  occupation: '학생' as Occupation,
  selectedHashtags: [] as string[],
  hasCompletedOnboarding: false,
};

const _newClientId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const _now = () => new Date().toISOString();

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  ...initialUserState,

  setUserName: (name) => set({ userName: name }),
  setUserIcon: (icon) => set({ userIcon: icon }),
  setPersonalityTypeId: (id, hashtags) => {
    const existing = get().personalityCurrent;
    const clientId = existing?.clientId || _newClientId();
    const testedAt = existing?.testedAt || _now();
    set({
      personalityTypeId: id,
      personalityCurrent: {
        clientId,
        typeId: id,
        hashtags,
        testedAt,
        updatedAt: _now(),
      },
    });
  },
  setIdealPersonalityTypeId: (id, hashtags) => {
    const existing = get().personalityIdeal;
    const clientId = existing?.clientId || _newClientId();
    const testedAt = existing?.testedAt || _now();
    set({
      idealPersonalityTypeId: id,
      personalityIdeal: {
        clientId,
        typeId: id,
        hashtags,
        testedAt,
        updatedAt: _now(),
      },
    });
  },
  setOccupation: (occupation) => set({ occupation }),
  setSelectedHashtags: (tags) => set({ selectedHashtags: tags }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  resetUser: () => set(initialUserState),
});
