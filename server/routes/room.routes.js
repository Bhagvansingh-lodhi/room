import express from 'express';
import {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/room.controller.js';
import protect from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', protect, authorize('owner'), upload.array('images', 6), createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.put('/:id', protect, updateRoom);
router.delete('/:id', protect, deleteRoom);

export default router;
