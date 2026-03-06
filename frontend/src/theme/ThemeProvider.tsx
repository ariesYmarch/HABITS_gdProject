import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { useAppStore } from '../store';
import { themes } from './themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeId = useAppStore(state => state.selectedTheme);
  const theme = themes[themeId];

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
