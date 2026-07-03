import express from 'express';
import {
  approveRoom,
  rejectRoom,
  getUsers,
  deleteUser,
  getRooms,
} from '../controllers/admin.controller.js';
import protect from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.patch('/rooms/:id/approve', protect, authorize('admin'), approveRoom);
router.patch('/rooms/:id/reject', protect, authorize('admin'), rejectRoom);
router.get('/users', protect, authorize('admin'), getUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/rooms', protect, authorize('admin'), getRooms);

export default router;
