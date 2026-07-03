import express from 'express';
import { register, login, logout, profile } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  asyncHandler(register)
);
router.post('/login', [body('email').isEmail(), body('password').exists()], asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/profile', protect, asyncHandler(profile));

export default router;
