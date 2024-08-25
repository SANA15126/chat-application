// userRoutes.js

import express from 'express';
import isLogin from '../middleware/isLogin.js'; 
import { getUserBySearch, getCorrentChatters } from '../routControllers/userhandlercontroller.js'; // Import both functions

const router = express.Router(); // Correct usage of Router

// Route to search users
router.get('/search', isLogin, getUserBySearch);

// Route to get current chatters
router.get('/currentchatters', isLogin, getCorrentChatters);

export default router;

