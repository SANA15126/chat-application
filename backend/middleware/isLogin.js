import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log('User found:', req.user);  // Debug log to check req.user

        next();
    } catch (error) {
        console.error('Error in isLogin middleware:', error);  // Improved error logging
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



export default isLogin;


