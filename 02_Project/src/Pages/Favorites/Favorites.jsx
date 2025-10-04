import React, { useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { GiWaterSplash } from "react-icons/gi";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const navigate = useNavigate()

  const handleDiveIn = () => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "explore-menu" } });
    } else {
      const menuSection = document.getElementById("explore-menu");
      if (menuSection) {
        const yOffset = -80;
        const y = menuSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const { favorites, foodList, addToCart, removeFromCart, cartItems, toggleFavorite } = useContext(StoreContext);

  // Filter only the favorited items
  const favoriteItems = foodList.filter(item => favorites.includes(item._id));

  return (
    <div className="pt-20 w-full px-6 md:px-12 lg:px-20 overflow-x-hidden min-h-screen my-10">
      {/* Header - matching FoodDisplay style */}
      <h2
        className="text-[25px] font-bold text-[#2e2e2e] flex gap-1 items-start px-8 sm:px-8 lg:px-8"  
        data-aos="fade-right"
        data-aos-delay="200"
      >
        My Favorites
        <FaHeart className="mt-1 ml-1 text-red-500" />
        <span className="ml-2 mt-0.5 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
          {favoriteItems.length}
        </span>
      </h2>

      {favoriteItems.length > 0 ? (
        <div className="overflow-y-hidden px-8">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              marginTop: '30px',
              gap: '30px',
              rowGap: '50px'
            }}
          >
            {favoriteItems.map((item, index) => (
              <div
                key={item._id}
                data-aos="fade-up"
                data-aos-delay={index * 5}
              >
                {/* Food Item Card - matching FoodItem style */}
                <div className="relative w-full h-[340px] pt-4 rounded-t-4xl drop-shadow-[0px_0px_5px_rgba(0,0,0,0.1)] bg-white overflow-x-hidden">
                  {/* Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="rounded-t-4xl w-full h-48 object-cover"
                  />
                  
                  {/* Cart controls */}
                  {!cartItems[item._id] ? (
                    <img
                      src={assets.add_icon_white}
                      alt="Add to cart"
                      onClick={() => addToCart(item._id)}
                      className="absolute top-40 right-4 w-8 h-8 cursor-pointer shadow-2xl
                        hover:scale-110 transition-all duration-100 ease-in-out"
                    />
                  ) : (
                    <div className="absolute top-40 right-4 flex items-center gap-2 bg-white rounded-full px-1 py-1 shadow-md">
                      <img
                        onClick={() => removeFromCart(item._id)}
                        src={assets.remove_icon_red}
                        alt="Remove"
                        className="w-7 h-7 cursor-pointer"
                      />
                      <p className="text-sm font-semibold">{cartItems[item._id]}</p>
                      <img
                        onClick={() => addToCart(item._id)}
                        src={assets.add_icon_green}
                        alt="Add"
                        className="w-7 h-7 cursor-pointer"
                      />
                    </div>
                  )}
                  
                  {/* Favorite button - always filled red since it's in favorites */}
                  <button
                    onClick={() => toggleFavorite(item._id)}
                    className="absolute bottom-6 right-4 cursor-pointer
                    transition-all duration-300 ease-in-out transform hover:scale-110"
                    style={{
                      color: "red",
                      transition: "color 0.3s ease, transform 0.3s ease",
                    }}
                  >
                    <FaHeart size={18} />
                  </button>
                  
                  {/* Text info */}
                  <div className="p-4 flex flex-col gap-2">
                    <p className="font-bold text-[17px] text-[#2e2e2e]">{item.name}</p>

                    <p className="font-medium text-[13px] leading-3.5 max-w-[180px]">
                      {item.description}
                    </p>

                    <p className="font-bold text-[15px] text-red-600">₦{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-8 mt-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaHeart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-[#2e2e2e] mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6 font-medium text-[13px]">Start adding items to your favorites!</p>
            <button 
              className="px-6 py-2 cursor-pointer bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              onClick={handleDiveIn}
            >
              Explore Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;