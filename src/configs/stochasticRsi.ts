import { CandleChartInterval } from 'binance-api-node';
import { atrExitStrategy } from '../strategies/exit';
import { Basics } from '../strategies/entry';
import { threeEma } from '../strategies/trend';
import { getPositionSizeByRisk } from '../strategies/riskManagement';
import { MAX_LOADED_CANDLE_LENGTH_API } from '../init';

export const hyperParameters: HyperParameters = {
  takeProfitAtrRatio: { value: 2, optimization: [1, 5] },
  stopLossAtrRatio: { value: 3, optimization: [1, 5] },
  atrPeriod: { value: 10, optimization: [5, 30] },
  atrMultiplier: { value: 2, optimization: [1, 3] },
  emaShortPeriod: { value: 8, optimization: [5, 10] },
  emaMediumPeriod: { value: 14, optimization: [11, 20] },
  emaLongPeriod: { value: 50, optimization: [21, 50] },
};

// @see https://www.youtube.com/watch?v=7NM7bR2mL7U&t=69s&ab_channel=TradePro
export const config: AbstractStrategyConfig = (parameters) => [
  {
    asset: 'BTC',
    base: 'USDT',
    loopInterval: CandleChartInterval.ONE_HOUR,
    indicatorIntervals: [CandleChartInterval.FIFTEEN_MINUTES],
    risk: 0.1,
    leverage: 10,
    trendFilter: (candles) =>
      threeEma.getTrend(
        candles[CandleChartInterval.FIFTEEN_MINUTES].slice(
          -MAX_LOADED_CANDLE_LENGTH_API
        ),
        {
          emaShortPeriod: parameters.emaShortPeriod.value,
          emaMediumPeriod: parameters.emaMediumPeriod.value,
          emaLongPeriod: parameters.emaLongPeriod.value,
        }
      ),
    exitStrategy: (price, candles, pricePrecision, side, exchangeInfo) =>
      atrExitStrategy(
        price,
        candles[CandleChartInterval.FIFTEEN_MINUTES].slice(
          -MAX_LOADED_CANDLE_LENGTH_API
        ),
        pricePrecision,
        side,
        exchangeInfo,
        {
          takeProfitAtrRatio: parameters.takeProfitAtrRatio.value,
          stopLossAtrRatio: parameters.stopLossAtrRatio.value,
          atrPeriod: parameters.atrPeriod.value,
          atrMultiplier: parameters.atrMultiplier.value,
        }
      ),
    buyStrategy: (candles) =>
      Basics.STOCHASTIC_RSI.isBuySignal(
        candles[CandleChartInterval.FIFTEEN_MINUTES].slice(
          -MAX_LOADED_CANDLE_LENGTH_API
        )
      ),
    sellStrategy: (candles) =>
      Basics.STOCHASTIC_RSI.isSellSignal(
        candles[CandleChartInterval.FIFTEEN_MINUTES].slice(
          -MAX_LOADED_CANDLE_LENGTH_API
        )
      ),
    riskManagement: getPositionSizeByRisk,
  },
];
