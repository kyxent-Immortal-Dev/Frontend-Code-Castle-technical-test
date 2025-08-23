import { useEffect } from 'react';
import { useThemeStore } from '../store/useTheme.store';

export const useThemeEffect = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme to HTML element for DaisyUI
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also update body class for additional styling if needed
    document.body.className = `theme-${theme}`;
  }, [theme]);
}; 