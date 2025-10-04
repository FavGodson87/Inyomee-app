import express from "express";
import { 
  adminLogin, 
  createAdmin, 
  validateAdminToken, 
  getAdmins,
  changeAdminPassword
} from "../controllers/adminController.js";
import { getRestaurantSettings, updateRestaurantSettings, updateSettingsSection } from "../controllers/restaurantSettingsController.js";
import { getAllOrders, updateAnyOrder } from "../controllers/orderController.js";
import adminAuthMiddleware from "../middleware/adminAuth.js";


const adminRouter = express.Router();

// Public routes
adminRouter.post('/login', adminLogin);

// Protected admin routes
adminRouter.use(adminAuthMiddleware);

adminRouter.get('/validate', validateAdminToken);
adminRouter.get('/admins', getAdmins); // Super admin only
adminRouter.post('/create', createAdmin);
adminRouter.put('/change-password' , changeAdminPassword)

// Restaurant Settings Routes
adminRouter.get('/settings', getRestaurantSettings);
adminRouter.put('/settings', updateRestaurantSettings);
adminRouter.patch('/settings/section', updateSettingsSection);

adminRouter.get('/orders' , getAllOrders)
adminRouter.put('/orders/:id', updateAnyOrder)

export default adminRouter;