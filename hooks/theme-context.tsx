import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    bg: string;
    card: string;
    text: string;
    secondaryText: string;
    header: string;
    border: string;
    primary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carregar preferência ao montar
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('darkMode');
        if (saved !== null) {
          setIsDarkMode(JSON.parse(saved));
        }
      } catch (e) {
        console.log('Erro ao carregar tema:', e);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
    } catch (e) {
      console.log('Erro ao salvar tema:', e);
    }
  };

  const colors = isDarkMode
    ? {
        bg: '#1a1a1a',
        card: '#2a2a2a',
        text: '#fff',
        secondaryText: '#bbb',
        header: '#242424',
        border: '#333',
        primary: '#4CAF50',
      }
    : {
        bg: '#ffffff',
        card: '#ffffff',
        text: '#333',
        secondaryText: '#666',
        header: '#ffffff',
        border: '#e0e0e0',
        primary: '#4CAF50',
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};
