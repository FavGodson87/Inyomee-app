import express from "express"
import { confirmPayment, createOrder, getAllOrders, getOrder, getOrderById, updateAnyOrder, updateOrder } from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router()

orderRouter.get('/getall', getAllOrders)
orderRouter.get('/getall/:id', updateAnyOrder)

// PROTECT ROUTES WITH MIDDLEWARE
orderRouter.use(authMiddleware)
orderRouter.post('/', createOrder)
orderRouter.get('/', getOrder)
orderRouter.get('/confirm', confirmPayment)
orderRouter.get('/:id', getOrderById)
orderRouter.put('/:id', updateOrder)

export default orderRouter
