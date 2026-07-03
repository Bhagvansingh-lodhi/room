import ApiResponse from '../utils/ApiResponse.js';

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';
  const errors = err.errors || [];
  res.status(status).json(ApiResponse(false, message, {}, errors));
};

export default errorHandler;
