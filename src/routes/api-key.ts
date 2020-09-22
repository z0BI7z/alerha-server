import { Router } from 'express';
import { apiKeyController } from '../controllers';
import { isAuth } from '../middleware';

const router = Router();

router.get('/', isAuth, apiKeyController.getApiKey);

router.post('/', isAuth, apiKeyController.createApiKey);

export default router;