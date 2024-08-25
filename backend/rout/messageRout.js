
import express from "express";
import { getMessage,sendMessage } from "../routControllers/messageController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();
router.post('/send/:id', isLogin, sendMessage);
// Route to fetch messages by receiverId
router.get('/message/:receiverId', isLogin, getMessage);

export default router;

