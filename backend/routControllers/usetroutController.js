import User from "../models/userModels.js";
import bcryptjs from 'bcryptjs';
import jwtToken from '../utilis/jwtwebToken.js';

// Register function
export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilephoto } = req.body;

        if (!fullname || !username || !email || !password || !gender) {
            return res.status(400).send({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) return res.status(409).send({ success: false, message: "Username or Email Already Exists" });

        const hashPassword = bcryptjs.hashSync(password, 10);
        const profilePic = profilephoto || (gender === "male" ? 
            `https://avatar.iran.liara.run/public/boy?username=${username}` : 
            `https://avatar.iran.liara.run/public/girl?username=${username}`);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilephoto: profilePic
        });

        await newUser.save();
        jwtToken(newUser._id, res);

        res.status(201).send({
            _id: newUser.id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilephoto: newUser.profilephoto,
            email: newUser.email,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ success: false, message: error.message });
    }
};

// Login function
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login attempt with non-existing email:", email);
            return res.status(404).send({ success: false, message: "Email doesn't Exist. Please Register" });
        }

        const comparePass = bcryptjs.compareSync(password, user.password);
        if (!comparePass) {
            console.log("Incorrect password for user:", email);
            return res.status(401).send({ success: false, message: "Email or Password is Incorrect" });
        }

        console.log("Successful login for user:", email);
        res.status(200).send({
            _id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilephoto: user.profilephoto,
            email: user.email,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ success: false, message: error.message });
    }
};

// Logout function
export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", '', { maxAge: 0 });
        res.status(200).send({ message: "User logged out" });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send({ success: false, message: error.message });
    }
};








