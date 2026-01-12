import express from 'express';
import { getProviders, getProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/providers', verifyToken, getProviders);
router.get('/me', verifyToken, getProfile);

export default router;
