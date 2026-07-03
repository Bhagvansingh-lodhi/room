import Room from '../models/Room.js';
import ApiError from '../utils/ApiError.js';

export const createRoom = async (data) => {
  const room = await Room.create(data);
  return room;
};

export const getRooms = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { approved: true };
  if (query.city) filter.city = new RegExp(query.city, 'i');
  if (query.roomType) filter.roomType = query.roomType;
  if (query.genderPreference) filter.genderPreference = query.genderPreference;
  if (query.minRent || query.maxRent) {
    filter.rent = {};
    if (query.minRent) filter.rent.$gte = Number(query.minRent);
    if (query.maxRent) filter.rent.$lte = Number(query.maxRent);
  }

  let sort = { createdAt: -1 };
  if (query.sort === 'rentLowToHigh') sort = { rent: 1 };
  if (query.sort === 'rentHighToLow') sort = { rent: -1 };

  const [rooms, total] = await Promise.all([
    Room.find(filter).sort(sort).skip(skip).limit(limit).populate('owner', 'name email phone'),
    Room.countDocuments(filter),
  ]);

  return { rooms, total, page, pages: Math.ceil(total / limit) };
};

export const getRoomById = async (id) => {
  const room = await Room.findById(id).populate('owner', 'name email');
  if (!room) throw new ApiError(404, 'Room not found');
  return room;
};

export const updateRoom = async (id, data, currentUser) => {
  const room = await Room.findById(id);
  if (!room) throw new ApiError(404, 'Room not found');
  if (room.owner.toString() !== currentUser._id.toString() && currentUser.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to edit this room');
  }
  Object.assign(room, data);
  await room.save();
  return room;
};

export const deleteRoom = async (id, currentUser) => {
  const room = await Room.findById(id);
  if (!room) throw new ApiError(404, 'Room not found');
  if (room.owner.toString() !== currentUser._id.toString() && currentUser.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this room');
  }
  await Room.findByIdAndDelete(id);
  return;
};

export default { createRoom, getRooms, getRoomById, updateRoom, deleteRoom };
