import User from "../models/userModal.js"
import Item from "../models/itemModal.js"
import mongoose from 'mongoose'; 

export const addFavorite = async (req, res) => {
    const session = await mongoose.startSession(); // Start a database session
    session.startTransaction(); // Start a transaction

    try {
        console.log("=== ADD FAVORITE ===");
        console.log("User ID:", req.user._id);
        console.log("Item ID:", req.params.itemId);

        const { itemId } = req.params;

        // Check if item exists FIRST
        const item = await Item.findById(itemId).session(session);
        if (!item) {
            await session.abortTransaction();
            session.endSession();
            console.log("Item not found");
            return res.status(404).json({ message: "Item not found" });
        }

        // Use findByIdAndUpdate with $addToSet to avoid race conditions AND duplicates in a single atomic operation.
        // $addToSet only adds the item if it's not already in the array.
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favorites: itemId } }, // The atomic update
            { new: true, session } // Return the updated document and use the session
        );

        if (!updatedUser) {
            await session.abortTransaction();
            session.endSession();
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Now update the item's heart count
        await Item.findByIdAndUpdate(
            itemId,
            { $inc: { hearts: 1 } },
            { session }
        );

        // If everything worked, commit the transaction
        await session.commitTransaction();
        session.endSession();

        console.log("Successfully added favorite and updated hearts");
        res.json({ success: true, favorites: updatedUser.favorites });

    } catch (error) {
        // If anything fails, abort the transaction
        await session.abortTransaction();
        session.endSession();
        console.error("ERROR in addFavorite:", error);
        res.status(500).json({ message: error.message });
    }
}

export const removeFavorite = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    console.log("=== REMOVE FAVORITE ==="); 
    console.log("User ID:", req.user._id); 
    console.log("Item ID:", req.params.itemId); 

    const { itemId } = req.params;

    // Remove item from user favorites
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: itemId } },
      { new: true, session }
    );

    if (!updatedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Decrease item hearts, but not below zero
    const item = await Item.findById(itemId).session(session);
    if (item) {
      item.hearts = Math.max(0, (item.hearts || 0) - 1);
      await item.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    console.log("Successfully removed favorite and updated hearts")
    res.json({ success: true, favorites: updatedUser.favorites });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("ERROR in removeFavorite:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getFavorites = async (req,res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    
    // Return the same format as other favorites endpoints
    if (user && user.favorites) {
      res.json({ success: true, favorites: user.favorites });
    } else {
      res.json({ success: true, favorites: [] });
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}