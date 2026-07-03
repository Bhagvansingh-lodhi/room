import asyncHandler from '../utils/asyncHandler.js';
import Review from '../models/Review.js';
import Room from '../models/Room.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const createReview = asyncHandler(async (req, res) => {
  const { room: roomId, rating, comment } = req.body;
  const exists = await Review.findOne({ user: req.user._id, room: roomId });
  if (exists) throw new ApiError(400, 'You have already reviewed this room');
  const review = await Review.create({ user: req.user._id, room: roomId, rating, comment });
  // Update average rating
  const agg = await Review.aggregate([
    { $match: { room: review.room } },
    { $group: { _id: '$room', avgRating: { $avg: '$rating' } } },
  ]);
  const avg = agg[0] ? agg[0].avgRating : rating;
  await Room.findByIdAndUpdate(review.room, { averageRating: avg });
  res.status(201).json(ApiResponse(true, 'Review created', { review }));
});

export const getReviewsByRoom = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ room: req.params.roomId }).populate('user', 'name');
  res.json(ApiResponse(true, 'Reviews fetched', { reviews }));
});

export default { createReview, getReviewsByRoom };
