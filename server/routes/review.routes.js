import express from 'express';
import { createReview, getReviewsByRoom } from '../controllers/review.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/:roomId', getReviewsByRoom);

export default router;
