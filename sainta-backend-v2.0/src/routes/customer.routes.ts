import express from 'express';
const router = express.Router();
import {
  createCustomer,
  fetchAllCustomers,
} from '../controllers/customer.controller';
import { isLoggedIn } from '../middlewares/auth.middleware';

router.post('/create-customer', [isLoggedIn], createCustomer);
router.get('/fetch-all-customers', [isLoggedIn], fetchAllCustomers);

export { router as customerRouter };
