import { Router } from 'express';
import { notificationController } from '../controllers';
import { isAuth } from '../middleware';

const router = Router();

router.post('/new-message', isAuth, notificationController.receiveMessage);

export default router;