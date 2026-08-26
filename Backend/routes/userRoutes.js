import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getMyProfile,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Private route — needs a valid token
router.get('/me', protect, getMyProfile);

export default router;