import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: typeof MD3LightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@noc_builder_theme';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === 'dark');
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
  };

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  // Customizing the theme for a more "wow" feel
  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: isDarkMode ? '#818CF8' : '#4F46E5', // Indigo 400/600
      secondary: isDarkMode ? '#C084FC' : '#9333EA', // Purple 400/600
    },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme: customTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}
