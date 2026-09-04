export type Fund = {
  ticker: string;
  name: string;
  category: string;
  currentPrice: number;
  currency: string;
};

export type Holding = Fund & {
  shares: number;
  avgCost: number;
  note?: string;
};
