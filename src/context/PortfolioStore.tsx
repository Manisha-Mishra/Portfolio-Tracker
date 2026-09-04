import {
  loadHoldingsFromStorageAsync,
  saveHoldingsToStorageAsync,
} from "@/components/portfolio/storage";
import { Holding } from "@/components/portfolio/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type PortfolioContextType = {
  holdings: Holding[];
  addHolding: (holding: Holding) => void;
  updateHolding: (ticker: string, holding: Holding) => void;
  removeHolding: (ticker: string) => void;
  setHoldings: (holdings: Holding[]) => void;
  loadHoldings: () => Promise<void>;
  isLoading: boolean;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [holdings, setHoldingsState] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHoldings = useCallback(async () => {
    const stored = await loadHoldingsFromStorageAsync();
    setHoldingsState(stored);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadHoldings();
  }, [loadHoldings]);

  const setHoldings = useCallback(async (newHoldings: Holding[]) => {
    setHoldingsState(newHoldings);
    await saveHoldingsToStorageAsync(newHoldings);
  }, []);

  const addHolding = useCallback(
    async (holding: Holding) => {
      const updated = [...holdings, holding];
      await setHoldings(updated);
    },
    [holdings, setHoldings],
  );

  const updateHolding = useCallback(
    async (ticker: string, updatedHolding: Holding) => {
      const updated = holdings.map((h) =>
        h.ticker === ticker ? updatedHolding : h,
      );
      await setHoldings(updated);
    },
    [holdings, setHoldings],
  );

  const removeHolding = useCallback(
    async (ticker: string) => {
      const updated = holdings.filter((h) => h.ticker !== ticker);
      await setHoldings(updated);
    },
    [holdings, setHoldings],
  );

  return (
    <PortfolioContext.Provider
      value={{
        holdings,
        addHolding,
        updateHolding,
        removeHolding,
        setHoldings,
        loadHoldings,
        isLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
};
