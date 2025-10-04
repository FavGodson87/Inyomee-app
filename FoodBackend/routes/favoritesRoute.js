import express from 'express'
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoritesController.js'
import authMiddleware from '../middleware/auth.js'

const favoritesRouter = express.Router()

favoritesRouter.post("/:itemId", authMiddleware, addFavorite)
favoritesRouter.delete("/:itemId", authMiddleware, removeFavorite)
favoritesRouter.get("/", authMiddleware, getFavorites)


export default favoritesRouter