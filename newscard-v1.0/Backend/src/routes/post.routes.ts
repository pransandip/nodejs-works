import express from 'express';
const router = express.Router();
import upload from '../utils/upload.function';
import { isLoggedIn } from '../middlewares/auth.middleware';
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchPosts,
  flagPost,
  likeComment,
  likePost,
  replyComment,
  unFlagPost,
  unLikeComment,
  unlikePost,
} from '../controllers/post.controller';

router.post('/like-post', [isLoggedIn], likePost);
router.post('/un-like-post', [isLoggedIn], unlikePost);
router.post('/fetch-post', [isLoggedIn], fetchPosts);
router.route('/flaged-post/:id').get([isLoggedIn], flagPost);
router.route('/un-flaged-post/:id').get([isLoggedIn], unFlagPost);
router.route('/delete-post/:id').delete([isLoggedIn], deletePost);
router.post('/create', upload.single('image'), [isLoggedIn], createPost);

router.post('/like-comment', [isLoggedIn], likeComment);
router.post('/un-like-comment', [isLoggedIn], unLikeComment);
router.post('/create-comment', [isLoggedIn], createComment);
router.post('/reply-comment', [isLoggedIn], replyComment);
router.route('/delete-comment/:id').delete([isLoggedIn], deleteComment);

export { router as postRouter };
