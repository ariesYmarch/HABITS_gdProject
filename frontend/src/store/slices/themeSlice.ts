import { StateCreator } from 'zustand';
import { ThemeId } from '../../theme/themes';

export interface ThemeSlice {
  selectedTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  selectedTheme: 'default',
  setTheme: (theme) => set({ selectedTheme: theme }),
});
