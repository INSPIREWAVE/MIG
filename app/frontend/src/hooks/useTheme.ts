import { useMemo, useState } from 'react';
import { THEMES, type ThemeName } from '../store/theme';

export const useTheme = (initialTheme: ThemeName = 'emerald') => {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);
  const theme = useMemo(() => THEMES[themeName], [themeName]);

  return { themeName, theme, setThemeName };
};
