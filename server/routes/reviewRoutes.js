import express from 'express';
import { createReview, getProviderReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createReview);
router.get('/:providerId', verifyToken, getProviderReviews);

export default router;
