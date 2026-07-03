import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(ApiResponse(true, 'User registered', { user }));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
  res.json(ApiResponse(true, 'Login successful', { user }));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json(ApiResponse(true, 'Logout successful'));
});

export const profile = asyncHandler(async (req, res) => {
  res.json(ApiResponse(true, 'User profile', { user: req.user }));
});

export default { register, login, logout, profile };
