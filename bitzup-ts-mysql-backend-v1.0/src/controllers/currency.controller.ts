import { Request, Response } from 'express';
import axios from 'axios';
import { IGainer, I24hVol, ICryptocurrency } from '../types/models.types';
import { prisma } from '../prisma/prisma.client';

/*----- Get All Popular Cryptocurrencies -----*/
export const getPopularCurrencies = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr',
    );

    // Filter and map the response to extract relevant data
    const popularCryptocurrencies = response.data
      .filter((item: any) => item.symbol.endsWith('USDT'))
      .map((item: any) => {
        return { ...item, symbol: item.symbol.replace('USDT', '') };
      })
      .slice(0, 10);

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched all Crypto currencies',
      data: popularCryptocurrencies,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Get Gainer Cryptocurrency List  -----*/
export const getGainerCurrencies = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr',
    );

    // Filter and map the response to extract relevant data
    const gainers: IGainer[] = response.data
      .filter((symbol: IGainer) => symbol.symbol.endsWith('USDT'))
      .map((symbol: IGainer) => ({
        symbol: symbol.symbol.replace('USDT', ''),
        priceChange: symbol.priceChange,
        priceChangePercent: symbol.priceChangePercent,
      }))
      .filter((symbol: IGainer) => symbol.priceChange > 0)
      .sort((a: IGainer, b: IGainer) => b.priceChange - a.priceChange)
      .slice(0, 10);

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched all gainers currencies',
      data: gainers,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Get Looser Cryptocurrency List  -----*/
export const getLooserCurrencies = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr',
    );

    // Filter and map the response to extract relevant data
    const loosers: IGainer[] = response.data
      .filter((symbol: IGainer) => symbol.symbol.endsWith('USDT'))
      .map((symbol: IGainer) => ({
        symbol: symbol.symbol.replace('USDT', ''),
        priceChange: symbol.priceChange,
        priceChangePercent: symbol.priceChangePercent,
      }))
      .filter((symbol: IGainer) => symbol.priceChange < 0)
      .sort((a: IGainer, b: IGainer) => a.priceChange - b.priceChange)
      .slice(0, 10);

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched all looser currencies',
      data: loosers,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Get 24h Vol List  -----*/
export const get24hVolList = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr',
    );

    // Filter and map the response to extract relevant data
    const volumeList: I24hVol[] = response.data
      .filter((symbol: I24hVol) => symbol.symbol.endsWith('USDT'))
      .map((symbol: I24hVol) => ({
        symbol: symbol.symbol.replace('USDT', ''),
        volume: symbol.volume,
      }))
      .slice(0, 10);

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched 24h Vol List',
      data: volumeList,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Add Favorites Cryptocurrency -----*/
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { id: userId }: { id: string } = req.body.user;
    const { currency }: { currency: string } = req.body;

    console.log({ userId, currency });

    if (!currency) {
      throw new Error('Please provide currency name first');
    }

    // check Currency
    const exists = await prisma.favoriteCurrency.findFirst({
      where: {
        userId: userId,
        currency: currency,
      },
    });

    // Currency present
    if (exists) {
      throw new Error('Currency already present in favorite list');
    }

    await prisma.favoriteCurrency.create({
      data: {
        currency,
        user: { connect: { id: userId } },
      },
    });

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully currency added to favorite list',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Get Favorites Cryptocurrency list -----*/
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const { id: userId }: { id: string } = req.body.user;

    if (!userId) {
      return res.json({ message: 'plz provide user id first' });
    }

    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr',
    );

    // Filter and map the response to extract relevant data
    const currencies: ICryptocurrency[] = response.data
      .filter((item: any) => item.symbol.endsWith('USDT'))
      .map((item: any) => {
        return { ...item, symbol: item.symbol.replace('USDT', '') };
      });

    const result = await prisma.favoriteCurrency.findMany({
      where: { userId: userId },
    });

    // Currency not present
    if (!result) {
      throw new Error('Currency favorite list is empty');
    }

    const favCurrencyList = result.flatMap(item =>
      currencies.filter(currency => currency.symbol === item.currency),
    );

    res.status(201).json({
      status: '1',
      message: 'successfully fetched all favorite currency',
      data: favCurrencyList,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
