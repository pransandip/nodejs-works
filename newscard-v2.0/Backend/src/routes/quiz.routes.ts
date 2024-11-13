import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware';
import {
  addQuestionAnswer,
  checkAnswer,
  fetchQuestion,
  removeQuestion,
} from '../controllers/quiz.controller';
const router = express.Router();

router.route('/add-question').post([isLoggedIn], addQuestionAnswer);
router.route('/fetch-question').post([isLoggedIn], fetchQuestion);
router.route('/check-answer').post([isLoggedIn], checkAnswer);
router.route('/remove-question/:id').delete([isLoggedIn], removeQuestion);

export { router as quizRouter };
