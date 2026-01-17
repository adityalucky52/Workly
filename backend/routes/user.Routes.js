import {Router} from 'express';
import {createUser,testApi,loginUser,logoutUser} from '../controller/User.controller.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create-user',createUser)
router.post('/login-user',loginUser)
router.post('/logout-user',authMiddleware,logoutUser)
router.get('/test',testApi)

export default router;