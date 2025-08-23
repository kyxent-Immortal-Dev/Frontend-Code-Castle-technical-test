import { ReactNode } from 'react';
import { useThemeEffect } from '../../hooks/useThemeEffect';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Apply theme effect
  useThemeEffect();

  return <>{children}</>;
}; 