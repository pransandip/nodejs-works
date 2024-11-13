export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  password: string;
}

export interface IUserPartial {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  password?: string;
}

export interface ICryptocurrency {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface IGainer {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
}

export interface I24hVol {
  symbol: string;
  volume: number;
}
