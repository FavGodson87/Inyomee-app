import mongoose from "mongoose";

const cartItemsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
}, {timestamps: true}
)

export const CartItem = mongoose.model('CartItem', cartItemsSchema)