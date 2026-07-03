import express from 'express';
import { saveRoom, unsaveRoom, getSavedRooms } from '../controllers/savedRoom.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/:roomId', protect, saveRoom);
router.delete('/:roomId', protect, unsaveRoom);
router.get('/', protect, getSavedRooms);

export default router;
