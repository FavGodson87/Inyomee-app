import jwt from "jsonwebtoken";
import User from "../models/userModal.js";

const { TokenExpiredError } = jwt;


const authMiddleware = async (req,res,next) => {
    const token = req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1] || req.cookies.token )

    if(!token) {
        return res.status(401).json({success:false, message:"Token Missing"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({success:false, message:"User not found"})
        }
        
        req.user = { _id:decoded.id, email:decoded.email }
        next()
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
        res.status(403).json({success:false, message})
    }
}

export default authMiddleware