import express from 'express';
const router = express.Router();
import { verifyOtp } from '../controllers/otp.controller';

router.route('/verify-otp').post(verifyOtp);

export { router as otpRouter };
