export type ThemeName = 'emerald' | 'sapphire' | 'amethyst' | 'sunset';

export type ThemePalette = {
  name: ThemeName;
  primary: string;
  accent: string;
  surface: string;
  text: string;
};

export const THEMES: Record<ThemeName, ThemePalette> = {
  emerald: { name: 'emerald', primary: '#10b981', accent: '#059669', surface: '#ecfdf5', text: '#064e3b' },
  sapphire: { name: 'sapphire', primary: '#2563eb', accent: '#1d4ed8', surface: '#eff6ff', text: '#1e3a8a' },
  amethyst: { name: 'amethyst', primary: '#8b5cf6', accent: '#7c3aed', surface: '#f5f3ff', text: '#4c1d95' },
  sunset: { name: 'sunset', primary: '#f97316', accent: '#ea580c', surface: '#fff7ed', text: '#7c2d12' }
};
