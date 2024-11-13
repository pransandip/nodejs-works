export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  country_code?: string;
  password: string;
  token?: string | null;
  otp_verify?: string;
  otp?: string;
  device_id?: string | null;
}

export interface IUserPartial {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  password?: string;
  token?: string | null;
  device_id?: string | null;
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

export interface IFavoriteCurrency {
  email: string;
  currency: string;
  type: string;
  base: string;
}

export interface IClientInfo {
  ip: string;
  network?: string;
  version?: string;
  city: string;
  region: string;
  region_code?: string;
  country_name: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utc_offset?: string;
  country_calling_code?: string;
  org?: string;
  os_name: string;
  os_version?: string;
  client_type: string;
  client_name: string;
  client_family?: string;
  device_type: string;
}
