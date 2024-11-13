import { prisma } from '../prisma/prisma.client';
import {
  ISocketCryptoCurrency,
  ISocketCurrencyData,
} from '../types/models.types';

const getCurrencyDetails = async () => {
  try {
    // fetch all currency data from DB
    const currencies: ISocketCryptoCurrency[] =
      await prisma.currencies.findMany({});

    // filter currencies with "hot" key equal to 1
    const hotCurrencies = currencies
      .filter(currency => currency.hot === 1)
      .map(currency => ({
        coin: currency.coin,
        symbol: currency.symbol,
        decimal: currency.decimal,
        pro_api_id: currency.pro_api_id,
        usdtprice: currency.usdtprice,
        change_in_price: currency.change_in_price,
        hot: currency.hot,
        status: currency.status,
      }));

    // filter currencies with "status" field equal to "Active"
    const activeCurrencies = currencies
      .filter(currency => currency.status === 'Active')
      .map(currency => ({
        coin: currency.coin,
        symbol: currency.symbol,
        decimal: currency.decimal,
        pro_api_id: currency.pro_api_id,
        usdtprice: currency.usdtprice,
        change_in_price: currency.change_in_price,
        hot: currency.hot,
        status: currency.status,
      }));

    // sort currencies by "change_in_price" to find gainers and losers
    const sortedCurrencies = currencies
      .slice()
      .sort((a, b) => b.change_in_price - a.change_in_price);

    // extract the top 10 gainers and last 10 losers
    const gainers = sortedCurrencies.slice(0, 10);
    const losers = sortedCurrencies.slice(-10);

    // Add symbols "BTC," "TRX," and "ETH" to the respective arrays if they exist
    const btcSymbol = currencies.find(currency => currency.symbol === 'BTC');
    const trxSymbol = currencies.find(currency => currency.symbol === 'TRX');
    const ethSymbol = currencies.find(currency => currency.symbol === 'ETH');

    if (btcSymbol) {
      gainers.push(btcSymbol);
      losers.push(btcSymbol);
      hotCurrencies.push(btcSymbol);
    }
    if (trxSymbol) {
      gainers.push(trxSymbol);
      losers.push(trxSymbol);
      hotCurrencies.push(trxSymbol);
    }
    if (ethSymbol) {
      gainers.push(ethSymbol);
      losers.push(ethSymbol);
      hotCurrencies.push(ethSymbol);
    }

    // map the currencies to include only the desired fields
    const gainersWithSelectedFields = gainers.map(
      (currency: ISocketCryptoCurrency) => ({
        coin: currency.coin,
        symbol: currency.symbol,
        decimal: currency.decimal,
        pro_api_id: currency.pro_api_id,
        usdtprice: currency.usdtprice,
        change_in_price: currency.change_in_price,
        hot: currency.hot,
        status: currency.status,
      }),
    );
    const losersWithSelectedFields = losers.map(
      (currency: ISocketCryptoCurrency) => ({
        coin: currency.coin,
        symbol: currency.symbol,
        decimal: currency.decimal,
        pro_api_id: currency.pro_api_id,
        usdtprice: currency.usdtprice,
        change_in_price: currency.change_in_price,
        hot: currency.hot,
        status: currency.status,
      }),
    );

    // create an object to store the organized data
    const currencyData: ISocketCurrencyData = {
      gainers: { data: gainersWithSelectedFields },
      losers: { data: losersWithSelectedFields },
      hotCurrencies: { data: hotCurrencies },
      activeCurrencies: { data: activeCurrencies },
    };

    return currencyData;
  } catch (err) {
    throw err;
  }
};

export default { getCurrencyDetails };
