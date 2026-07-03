import asyncHandler from '../utils/asyncHandler.js';
import * as roomService from '../services/room.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';

export const createRoom = asyncHandler(async (req, res) => {
  if (req.user.role !== 'owner') throw new ApiError(403, 'Only owners can create rooms');
  
  const data = { ...req.body, owner: req.user._id };
  
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'studentnest/rooms' },
          (err, result) => {
            if (err) reject(err);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );
        stream.end(file.buffer);
      });
    });
    data.images = await Promise.all(uploadPromises);
  }
  
  const room = await roomService.createRoom(data);
  res.status(201).json(ApiResponse(true, 'Room created', { room }));
});

export const getRooms = asyncHandler(async (req, res) => {
  const result = await roomService.getRooms(req.query);
  res.json(ApiResponse(true, 'Rooms fetched', result));
});

export const getRoom = asyncHandler(async (req, res) => {
  const room = await roomService.getRoomById(req.params.id);
  res.json(ApiResponse(true, 'Room fetched', { room }));
});

export const updateRoom = asyncHandler(async (req, res) => {
  const room = await roomService.updateRoom(req.params.id, req.body, req.user);
  res.json(ApiResponse(true, 'Room updated', { room }));
});

export const deleteRoom = asyncHandler(async (req, res) => {
  await roomService.deleteRoom(req.params.id, req.user);
  res.json(ApiResponse(true, 'Room deleted'));
});

export default { createRoom, getRooms, getRoom, updateRoom, deleteRoom };
