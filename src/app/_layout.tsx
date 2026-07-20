import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { PortfolioProvider } from '@/context/PortfolioStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <PortfolioProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </PortfolioProvider>
  );
}
