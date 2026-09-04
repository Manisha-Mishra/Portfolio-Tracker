import AsyncStorage from '@react-native-async-storage/async-storage';
import { Holding } from "@/components/portfolio/types";

const STORAGE_KEY = "portfolio_holdings";

const isWebPlatform = (): boolean => {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
};

export async function loadHoldingsFromStorageAsync(): Promise<Holding[]> {
  try {
    if (isWebPlatform()) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } else {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  } catch {
    return [];
  }
}

export function loadHoldingsFromStorage(): Holding[] {
  if (isWebPlatform()) {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function saveHoldingsToStorageAsync(holdings: Holding[]): Promise<void> {
  try {
    if (isWebPlatform()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    }
  } catch {
    // ignore write errors
  }
}

export function saveHoldingsToStorage(holdings: Holding[]) {
  if (isWebPlatform()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    } catch {
      // ignore write errors
    }
  }
}
