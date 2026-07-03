import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) token = req.cookies.token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new ApiError(401, 'Not authorized, token missing'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new ApiError(401, 'No user found for this token'));
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, 'Token invalid or expired'));
  }
};

export default protect;
