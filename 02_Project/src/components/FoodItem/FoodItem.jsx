import React, { useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useModal } from "../Modal/useModal";


const FoodItem = ({ _id, name, price, description, image }) => {
  const { favorites, toggleFavorite, cartItems, addToCart, removeFromCart, token, authLoading} = useContext(StoreContext);
  const { openModal } = useModal();

  const isFavorite = favorites.includes(_id);

  const handleAddToCart = () => {
    if (authLoading) return
    if (!token) {
      openModal({
        title: "Login Required",
        message: "You must be logged in to add items to your cart!",
      });
      return;
    }
    addToCart(_id);
  };

  const handleToggleFavorite = () => {
    if (authLoading) return;
    if (!token) {
      openModal({
        title: "Login Required",
        message: "You must be logged in to add items to your favorites!",
      });
      return;
    }
    toggleFavorite(_id);
  };

  return (
    <div>
      {/* Card */}
      <div className="relative w-full h-[340px] pt-4 rounded-t-4xl drop-shadow-[0px_0px_5px_rgba(0,0,0,0.1)] bg-white overflow-x-hidden">
        {/* Image */}
        <img
          src={image}
          alt={name}
          className="rounded-t-4xl w-full h-48 object-cover"
        />
        {/* Cart controls */}
        {!cartItems[_id] ? (
          <img
            src={assets.add_icon_white}
            alt="Add to cart"
            onClick={handleAddToCart}
            className="absolute top-40 right-4 w-8 h-8 cursor-pointer shadow-2xl
              hover:scale-110 transition-all duration-100 ease-in-out"
          />
        ) : (
          <div className="absolute top-40 right-4 flex items-center gap-2 bg-white rounded-full px-1 py-1 shadow-md">
            <img
              onClick={() => removeFromCart(_id)}
              src={assets.remove_icon_red}
              alt="Remove"
              className="w-7 h-7 cursor-pointer"
            />
            <p className="text-sm font-semibold">{cartItems[_id]}</p>
            <img
              onClick={handleAddToCart}
              src={assets.add_icon_green}
              alt="Add"
              className="w-7 h-7 cursor-pointer"
            />
          </div>
        )}
        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute bottom-6 right-4 cursor-pointer
          transition-all duration-300 ease-in-out transform hover:scale-110"
          style={{
            color: isFavorite ? "red" : "gray",
            transition: "color 0.3s ease, transform 0.3s ease",
          }}
        >
          <FaHeart size={18} />
        </button>
        {/* Text info */}
        <div className="p-4 flex flex-col gap-2">
          <p className="font-bold text-[17px] text-[#2e2e2e]">{name}</p>

          <p className="font-medium text-[13px] leading-3.5 max-w-[180px]">
            {description}
          </p>

          <p className="font-bold text-[15px] text-red-600">₦{price}</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
