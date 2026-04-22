import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { ThemeName } from '../store/theme';

type ThemeContextValue = ReturnType<typeof useTheme>;
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const value = useTheme('emerald');
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
  return context;
};

export const ThemeSwitcher = () => {
  const { themeName, setThemeName } = useThemeContext();
  const themeOptions: ThemeName[] = ['emerald', 'sapphire', 'amethyst', 'sunset'];

  return (
    <select value={themeName} onChange={(e) => setThemeName(e.target.value as ThemeName)}>
      {themeOptions.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
