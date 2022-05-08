interface Database {
  history: {
    [date: string]: MockAccount;
  };
  strategyResults: StrategyResults;
}

interface Wallet {
  availableBalance: number;
  totalWalletBalance: number;
  totalUnrealizedProfit: number;
  positions: Position[];
}

interface Position {
  pair: string;
  size: number; // Asset size
  margin: number; // Base margin
  entryPrice: number;
  positionSide: 'LONG' | 'SHORT';
  leverage: number;
  unrealizedProfit: number;
}

interface OpenOrder {
  id: string;
  pair: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'TRAILING_STOP_MARKET';
  trailingStop?: {
    callbackRate: number; // % between 0-1
    activation: { changePercentage?: number; percentageToTP: number }; // % between 0-1
    status: 'PENDING' | 'ACTIVE';
  };
}

/**
 * @see: https://www.metatrader5.com/fr/terminal/help/algotrading/testing_report
 */
interface StrategyReport {
  testPeriod?: string;
  initialCapital?: number;
  finalCapital?: number;
  numberSymbol?: number;
  totalNetProfit?: number;
  totalFees?: number;
  totalBars?: number;
  totalTrades?: number;
  totalLongTrades?: number;
  totalShortTrades?: number;
  profitFactor?: number;
  totalProfit?: number;
  totalLoss?: number;
  maxAbsoluteDrawdown?: number;
  maxRelativeDrawdown?: number;
  totalWinRate?: number;
  longWinRate?: number;
  shortWinRate?: number;
  longWinningTrade?: number;
  longLostTrade?: number;
  shortWinningTrade?: number;
  shortLostTrade?: number;
  avgProfit?: number;
  avgLoss?: number;
  maxProfit?: number;
  maxLoss?: number;
  maxConsecutiveProfit?: number;
  maxConsecutiveLoss?: number;
  maxConsecutiveWinsCount?: number;
  maxConsecutiveLossesCount?: number;
}

type TradesHistoric = TradesHistoricRow[];

interface TradesHistoricRow {
  date: Date;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'TRAILING_STOP_MARKET';
  action: 'OPEN' | 'CLOSE';
  size: number;
  price: number;
  pnl: number;
  balance: number;
}
