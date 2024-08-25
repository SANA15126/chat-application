import jwt from "jsonwebtoken";

const jwtToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Make sure this is only true in production
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
};

export default jwtToken;

