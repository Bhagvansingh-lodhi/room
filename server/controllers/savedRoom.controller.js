import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const saveRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.roomId);
  if (!room) throw new ApiError(404, 'Room not found');
  const user = await User.findById(req.user._id);
  if (user.savedRooms.includes(room._id)) return res.json(ApiResponse(true, 'Room already saved'));
  user.savedRooms.push(room._id);
  await user.save();
  res.json(ApiResponse(true, 'Room saved'));
});

export const unsaveRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.savedRooms = user.savedRooms.filter(r => r.toString() !== req.params.roomId);
  await user.save();
  res.json(ApiResponse(true, 'Room unsaved'));
});

export const getSavedRooms = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedRooms');
  res.json(ApiResponse(true, 'Saved rooms fetched', { savedRooms: user.savedRooms }));
});

export default { saveRoom, unsaveRoom, getSavedRooms };
