import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const approveRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new ApiError(404, 'Room not found');
  room.approved = true;
  await room.save();
  res.json(ApiResponse(true, 'Room approved', { room }));
});

export const rejectRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new ApiError(404, 'Room not found');
  room.approved = false;
  await room.save();
  res.json(ApiResponse(true, 'Room rejected', { room }));
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(ApiResponse(true, 'Users fetched', { users }));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(ApiResponse(true, 'User deleted'));
});

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().populate('owner', 'name email');
  res.json(ApiResponse(true, 'Rooms fetched', { rooms }));
});

export default { approveRoom, rejectRoom, getUsers, deleteUser, getRooms };
