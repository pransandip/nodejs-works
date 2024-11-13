import express from 'express';
const router = express.Router();
import {
  logIn,
  logOut,
  signUp,
  activateAccount,
  getEmailVerifiedPage,
} from '../controllers/user.controller';
import { isUserValid } from '../middlewares/validate.middleware';
import { isDeviceRecognized } from '../middlewares/2FA.middleware';
import { isLoggedIn } from '../middlewares/auth.middleware';

router.post('/signup', [isUserValid], signUp);
router.get('/verified', getEmailVerifiedPage);
router.get('/authentication/activate/:token', activateAccount);

router.post('/login', [isDeviceRecognized], logIn);
router.get('/logout', [isLoggedIn], logOut);

export { router as userRouter };
