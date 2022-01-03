import { CandleChartInterval } from 'binance-api-node';
import { RSI } from './strategies/buy_sell';
import { isOverTrendLine } from './strategies/trend/supertrend';
import basicTpslStrategy from './strategies/tpsl/basic';

// ============================ CONST =================================== //

// The bot will trade with the binance :
export const BINANCE_MODE: BinanceMode = 'futures';

// ====================================================================== //

export const tradeConfigs: TradeConfig[] = [
  {
    asset: 'BTC',
    base: 'USDT',
    loopInterval: CandleChartInterval.FIVE_MINUTES,
    indicatorInterval: CandleChartInterval.ONE_WEEK,
    allocation: 0.02,
    leverage: 20,
    lossTolerance: 0.005,
    useTrailingStop: true,
    allowPyramiding: false,
    unidirectional: true,
    checkTrend: isOverTrendLine,
    tpslStrategy: basicTpslStrategy,
    buyStrategy: (candles: ChartCandle[]) =>
      RSI.isBuySignal(candles, {
        rsiOverbought: 70,
        rsiOversold: 30,
        rsiPeriod: 7,
        signalAtBreakout: true,
      }),
    sellStrategy: (candles: ChartCandle[]) =>
      RSI.isSellSignal(candles, {
        rsiOverbought: 70,
        rsiOversold: 30,
        rsiPeriod: 7,
        signalAtBreakout: true,
      }),
  },
];
