import jwt from "jsonwebtoken";
import Admin from "../models/adminModal.js";

const adminAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.adminToken || 
                 (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({
            success: false, 
            message: "Admin token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if it's an admin token (has role property)
        if (!decoded.role || !decoded.permissions) {
            return res.status(401).json({
                success: false, 
                message: "Invalid admin token"
            });
        }

        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false, 
                message: "Admin not found or inactive"
            });
        }
        
        req.admin = {
            _id: admin._id,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions
        };
        
        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? 'Admin token expired' : 'Invalid admin token';
        res.status(403).json({
            success: false, 
            message
        });
    }
};

export default adminAuthMiddleware;