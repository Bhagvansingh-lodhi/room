import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const register = async ({ name, email, password, role, phone, city }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already in use');
  const user = await User.create({ name, email, password, role, phone, city });
  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  const userResponse = user.toObject();
  delete userResponse.password;
  return { user: userResponse, token };
};

export default { register, login };
