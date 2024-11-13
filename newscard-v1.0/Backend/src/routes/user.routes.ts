import express from 'express';
const router = express.Router();
import {
  logIn,
  LogOut,
  signUp,
  validateSignUpUser,
  activateAccount,
  getEmailVerifiedPage,
  forgotPass,
  followUser,
  updateUser,
  fetchUsers,
  deleteUser,
  assignUserRole,
  unFollowUser,
  fetchUserByEmail,
  fetchConnectedUserByEmail,
} from '../controllers/user.controller';
import upload from '../utils/upload.function';
import { isLoggedIn } from '../middlewares/auth.middleware';
import { isDeviceRecognized } from '../middlewares/2FA.middleware';

router.post('/validate-signup-user', validateSignUpUser);
router.post('/signup', upload.single('image'), signUp);
router.post('/login', [isDeviceRecognized], logIn);
router.get('/logout', [isLoggedIn], LogOut);
router.post('/forgot-password', forgotPass);
router.get('/verified', getEmailVerifiedPage);
router.get('/authentication/activate/:token', activateAccount);

router.route('/follow-user').post([isLoggedIn], followUser);
router.route('/un-follow-user').post([isLoggedIn], unFollowUser);
router.route('/fetch-users-list').get([isLoggedIn], fetchUsers);
router.route('/fetch-user').post([isLoggedIn], fetchUserByEmail);
router
  .route('/fetch-connected-user')
  .post([isLoggedIn], fetchConnectedUserByEmail);
router.route('/delete-user/:id').delete([isLoggedIn], deleteUser);
router.route('/assign-user-role').post([isLoggedIn], assignUserRole);
router.route('/update').put(upload.single('image'), [isLoggedIn], updateUser);

export { router as userRouter };
