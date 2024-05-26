export interface CryptoSymbol {
  binance?: string;
  kucoin?: string;
  bybit?: string;
  gateio?: string;
  coinbase?: string;
  mexc?: string;
  okx?: string;
}

export interface RankDiffs {
  hour: number;
  day: number;
  week: number;
  month: number;
  year: number;
}

export interface Performance {
  hour: number;
  min1: number;
  min5: number;
  min15: number;
  day: number;
  week: number;
  month: number;
  year: number;
}

export interface Coin {
  id: string;
  name: string;
  slug: string;
  rank: number;
  symbol: string;
  symbols: CryptoSymbol;
  image: string;
  stable: boolean;
  circulating_supply: number;
  dominance: number;
  rankDiffs: RankDiffs;
  cg_id: string;
  price: number;
  marketcap: number;
  volume: number;
  performance: Performance;
  percental?: string;
}

export type Cryptobubbles = Array<Coin>