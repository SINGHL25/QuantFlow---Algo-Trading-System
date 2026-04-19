export interface Trade {
  id: string;
  date: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  strategy: string;
  mode: 'PAPER' | 'LIVE';
  notes?: string;
}

export interface Signal {
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  score: number;
  timestamp: string;
  timeframe: string;
}

export interface RiskConfig {
  maxDailyLoss: number;
  riskPerTrade: number;
  maxOpenPositions: number;
}
