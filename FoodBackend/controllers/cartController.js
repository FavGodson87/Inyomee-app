import asyncHandler from "express-async-handler";
import { CartItem } from "../models/cartModal.js";




// GET CART
export const getCart = asyncHandler(async (req, res) => {
  const items = await CartItem.find({ user: req.user._id }).populate("item");

  const formatted = items.map((ci) => ({
    _id: ci._id.toString(),
    item: ci.item,
    quantity: ci.quantity,
  }));
  res.json(formatted);
});

// ADD TO CART
export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  if (!itemId || typeof quantity !== "number") {
    res.status(400);
    throw new Error("itemId and quantity are required");
  }

  let cartItem = await CartItem.findOne({ user: req.user._id, item: itemId });

  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + quantity);

    if (cartItem.quantity < 1) {
      await cartItem.remove();
      return res.json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: 0,
      });
    }
    await cartItem.save();
    await cartItem.populate("item");
    return res.status(200).json({
      _id: cartItem._id.toString(),
      item: cartItem.item,
      quantity: cartItem.quantity,
    });
  }
  cartItem = await CartItem.create({
    user: req.user._id,
    item: itemId,
    quantity,
  });
  await cartItem.populate("item");
  res.status(201).json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});

// UPDATE CART METHOD
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cartItem = await CartItem.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }
  cartItem.quantity = Math.max(1, quantity);
  await cartItem.save();
  await cartItem.populate("item");
  res.json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});


// DELETE FUNCTION - SUPPORTS "force" QUERY
export const deleteCartItem = asyncHandler(async (req, res) => {
  const { id: itemId } = req.params; // this is the food/item ID
  const forceDelete = req.query.force === "true"; // check for ?force=true

  console.log(" BACKEND: Removing item:", itemId, "force?", forceDelete);

  const cartItem = await CartItem.findOne({
    item: itemId,
    user: req.user._id,
  });

  if (!cartItem) {
    return res.status(200).json({
      message: "Item already removed",
      itemId,
    });
  }

  // If force delete → remove completely
  if (forceDelete) {
    await cartItem.deleteOne();
    console.log("BACKEND: Item deleted completely");
    return res.json({ message: "Item deleted completely", itemId, quantity: 0 });
  }

  // ➖ Otherwise → decrement like before
  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    await cartItem.save();
    await cartItem.populate("item");
    return res.json({
      _id: cartItem._id.toString(),
      item: cartItem.item,
      quantity: cartItem.quantity,
    });
  }

  // If quantity = 1 → delete
  await cartItem.deleteOne();
  res.json({ message: "Item deleted", itemId, quantity: 0 });
});


// CLEAR CART FUNCTION
export const clearCart = asyncHandler( async (req,res) => {
    await CartItem.deleteMany({user: req.user._id})
    res.json({message: 'Cart Cleared'})
})