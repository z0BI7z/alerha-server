import { Router } from 'express';
import { authController } from '../controllers';
import { isAuth } from '../middleware';

const router = Router();

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/logout', isAuth, authController.logout);

router.get('/users', authController.getUsers);

router.post('/refresh-token', isAuth, authController.refreshToken);

router.delete('/refresh-token', isAuth, authController.deleteUserRefreshTokens);

router.post('/reset-email', isAuth, authController.resetEmail);

router.get('/secret', isAuth, (req, res) => {
  res.json({
    message: 'success',
  });
});

export default router;