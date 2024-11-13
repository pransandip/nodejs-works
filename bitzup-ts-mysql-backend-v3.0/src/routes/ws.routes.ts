import express from 'express';
const router = express.Router();
import { getCurrencyFeed } from '../controllers/ws.controller';

router.get('/currency', getCurrencyFeed);

export { router as wsRouter };
