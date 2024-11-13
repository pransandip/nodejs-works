import express from 'express';
const router = express.Router();
import {
  getPopularCurrencies,
  getGainerCurrencies,
  getLooserCurrencies,
  get24hVolList,
  addFavorite,
  getFavorites,
} from '../controllers/currency.controller';
import { verifyUser } from '../middleware/middleware';

router.get('/hot-currencies', getPopularCurrencies);
router.get('/gainers', getGainerCurrencies);
router.get('/loosers', getLooserCurrencies);
router.get('/24h-vol', get24hVolList);

router.route('/add-favorite').post([verifyUser], addFavorite);
router.route('/favorites').get([verifyUser], getFavorites);

export { router as currencyRouter };
