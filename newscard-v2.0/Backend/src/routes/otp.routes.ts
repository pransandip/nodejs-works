import express from 'express';
const router = express.Router();
import { sendOTP } from '../controllers/otp.controller';

router.route('/send-otp').post(sendOTP);

export { router as otpRouter };
