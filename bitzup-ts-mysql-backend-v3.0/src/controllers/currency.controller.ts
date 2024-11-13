import { Request, Response } from 'express';
import axios from 'axios';
import {
  IGainer,
  I24hVol,
  ICryptocurrency,
  IFavoriteCurrency,
} from '../types/models.types';
import { prisma } from '../prisma/prisma.client';

/*----- Get All Popular Cryptocurrencies -----*/
export const getPopularCurrencies = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr',
    );

    // Filter and map the response to extract relevant data
    const popularCryptocurrencies: ICryptocurrency[] = response.data
      .filter((item: any) => item.symbol.endsWith('USDT'))
      .map((item: any) => {
        return { ...item, symbol: item.symbol.replace('USDT', '') };
      })
      .slice(0, 10);

    // favorite currency array
    const result = (await prisma.favoritecurrency.findMany({})).map(
      item => item.currency,
    );

    // checking favorite currency
    const hotCurrencyList = popularCryptocurrencies.map(item => {
      if (result.includes(item.symbol)) {
        return { ...item, favorite: true };
      }
      return { ...item, favorite: false };
    });

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched all Crypto currencies',
      data: hotCurrencyList,
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

    // favorite currency array
    const result = (await prisma.favoritecurrency.findMany({})).map(
      item => item.currency,
    );

    // checking favorite currency
    const gainersList = gainers.map(item => {
      if (result.includes(item.symbol)) {
        return { ...item, favorite: true };
      }
      return { ...item, favorite: false };
    });

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched all gainers currencies',
      data: gainersList,
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

    // favorite currency array
    const result = (await prisma.favoritecurrency.findMany({})).map(
      item => item.currency,
    );

    // checking favorite currency
    const loosersList = loosers.map(item => {
      if (result.includes(item.symbol)) {
        return { ...item, favorite: true };
      }
      return { ...item, favorite: false };
    });

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched all looser currencies',
      data: loosersList,
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

    // favorite currency array
    const result = (await prisma.favoritecurrency.findMany({})).map(
      item => item.currency,
    );

    // checking favorite currency
    const volumeList24hr = volumeList.map(item => {
      if (result.includes(item.symbol)) {
        return { ...item, favorite: true };
      }
      return { ...item, favorite: false };
    });

    // send fetched data to user
    res.status(201).json({
      success: '1',
      message: 'successfully fetched 24h Vol List',
      data: volumeList24hr,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};

/*----- Add Favorites Cryptocurrency -----*/
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { id: userId }: { id: number } = req.body.user;
    const { currency, type, base, email }: IFavoriteCurrency = req.body;

    if (!userId) {
      return res.json({
        success: '0',
        message: 'You are not authorized or user not present',
      });
    }

    // field validation
    if (!currency || !type || !base || !email) {
      throw new Error('Please provide all the fields');
    }

    // Check Email
    if (!email.trim().includes('@gmail.com')) {
      throw new Error('Please provide valid email address');
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // user not present
    if (!user) {
      throw new Error('User not found');
    }

    // check Currency
    const exists = await prisma.favoritecurrency.findFirst({
      where: {
        email: email,
        currency: currency,
      },
    });

    if (type === 'false') {
      // Currency not present
      if (!exists) {
        throw new Error('Currency not present in favorite list');
      }

      await prisma.favoritecurrency.delete({
        where: { id: exists.id },
      });

      return res.status(200).json({
        success: '1',
        message: 'successfully deleted currency from favorite list',
      });
    }

    // Currency present
    if (exists) {
      throw new Error('Currency already present in favorite list');
    }

    await prisma.favoritecurrency.create({
      data: {
        currency,
        base,
        email,
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
    const { email: email }: { email: string } = req.body.user;

    if (!email) {
      return res.json({
        success: '0',
        message: 'You are not authorized or user not present',
      });
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

    const result = await prisma.favoritecurrency.findMany({
      where: { email: email },
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
