import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [preferences, setPreferences] = useState({
    fontSize: 'medium',
    lineHeight: 'normal'
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    const storedPreferences = JSON.parse(localStorage.getItem('preferences') || '{"fontSize":"medium","lineHeight":"normal"}');
    setTheme(storedTheme);
    setPreferences(storedPreferences);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('preferences', JSON.stringify(updated));
  };

  const value = {
    theme,
    toggleTheme,
    preferences,
    updatePreferences
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
