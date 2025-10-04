import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import FoodItem from "../components/FoodItem/FoodItem";
import { StoreContext } from "../Context/StoreContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const { foodList, favorites, toggleFavorite } = useContext(StoreContext);
  const query = useQuery().get("query") || "";

  const filteredFood = foodList.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="py-20 px-4 lg:px-8">
      <h2 className="text-[20px] md:text-[30px] xl:text-2xl lg:text-2xl font-bold my-4">Results for "{query}"</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFood.map((item) => (
          <FoodItem
            key={item._id}
            _id={item._id}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.imageUrl}
            isFavorite={favorites.includes(item._id)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
