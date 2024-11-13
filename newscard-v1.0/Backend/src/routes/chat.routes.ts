import express from 'express';
import { fetchMessages, sendMessage } from '../controllers/chat.controller';
const router = express.Router();

router.route('/send-message').post(sendMessage);
router.route('/fetch-messages').post(fetchMessages);
export { router as chatRouter };
