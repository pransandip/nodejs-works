import express from 'express';
const router = express.Router();
import {
  signUp,
  logIn,
  forgotPass,
  getAllCountries,
} from '../controllers/user.controller';

router.post('/login', logIn);
router.post('/signup', signUp);
router.post('/forgot-password', forgotPass);
router.get('/get-all-countries', getAllCountries);

export { router as userRouter };
