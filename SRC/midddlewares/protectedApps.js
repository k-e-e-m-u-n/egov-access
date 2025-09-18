import User from '../models/admin.model.js'
import Admin from '../models/admin.model.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const protectRoute = async(res, req, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password')
        const admin = await Admin.findById(decoded.adminId).select('-password')

        req.user = user;
        req.admin = admin;
         
        next();
    } catch(err) {
        res.status(500).json({message: err.message});
        console.log("Error in signUpUser", err.message);
    }
}

export default protectRoute
