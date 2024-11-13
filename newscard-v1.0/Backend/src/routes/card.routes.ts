import express from 'express';
const router = express.Router();
import upload from '../utils/upload.function';
import {
  createCard,
  deletePersonalCard,
  fetchCard,
  personalCard,
  followCard,
  updateCard,
  deleteCard,
  flagCard,
  suspendCard,
  createArticle,
  fetchArticle,
  sendDirectMsg,
  fetchDirectMsgs,
  unFollowCard,
  unFlagCard,
  unSuspendCard,
} from '../controllers/card.controller';
import { isLoggedIn } from '../middlewares/auth.middleware';

router.get('/fetch-card', [isLoggedIn], fetchCard);
router.post('/create', upload.single('image'), [isLoggedIn], createCard);

router.route('/follow-card').post([isLoggedIn], followCard);
router.route('/un-follow-card').post([isLoggedIn], unFollowCard);
router.route('/personal-card').get([isLoggedIn], personalCard);
router.route('/flaged-card/:id').get([isLoggedIn], flagCard);
router.route('/un-flaged-card/:id').get([isLoggedIn], unFlagCard);
router.route('/suspend-card/:id').get([isLoggedIn], suspendCard);
router.route('/un-suspend-card/:id').get([isLoggedIn], unSuspendCard);
router.route('/personal-card/:id').delete([isLoggedIn], deletePersonalCard);
router.route('/delete-card/:id').delete([isLoggedIn], deleteCard);
router
  .route('/update-card/:id')
  .put(upload.single('image'), [isLoggedIn], updateCard);

router.post('/create-article', [isLoggedIn], createArticle);
router.post('/fetch-article', [isLoggedIn], fetchArticle);
router.post('/send-direct-msg', [isLoggedIn], sendDirectMsg);
router.post('/fetch-direct-msg', [isLoggedIn], fetchDirectMsgs);

export { router as cardRouter };
