import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { GiWaterSplash } from "react-icons/gi";
import FoodItem from "../FoodItem/FoodItem";
import { motion } from "framer-motion";
import { useAnimationOnce } from "../Framer/useAnimateOnce";

const FoodDisplay = ({ category, searchQuery = "" }) => {
  const { foodList, favorites, toggleFavorite } = useContext(StoreContext);
  
  const hasAnimated = useAnimationOnce("food-display");

  const filteredFood = foodList.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const motionProps = (delay = 0) => ({
    initial: hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    whileInView: hasAnimated ? {} : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  });

  return (
    <div
      className="pt-20 w-full px-6 md:px-12 lg:px-20 overflow-x-hidden"
      id="food-display"
    >
      <motion.h2 
        {...motionProps(0)}
        className="text-[25px] font-bold text-[#2e2e2e] flex gap-1 items-start px-8 sm:px-8 lg:px-8"
      >
        Tasty Picks
        <motion.span
          initial={hasAnimated ? { scale: 1 } : { scale: 0 }}
          whileInView={hasAnimated ? {} : { scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
        >
          <GiWaterSplash className="mt-0.5 text-green-500" />
        </motion.span>
      </motion.h2>

      <div className="overflow-y-hidden px-8">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            marginTop: "30px",
            gap: "30px",
            rowGap: "50px",
          }}
        >
          {filteredFood.map((item, index) => (
            <motion.div
              key={item._id}
              initial={hasAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              whileInView={hasAnimated ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.9, 
                delay: 0,
                ease: "easeOut"
              }}
              // whileHover={{ 
              //   scale: 1.03,
              //   transition: { duration: 0.1 } 
              // }}
            >
              <FoodItem
                _id={item._id}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.imageUrl}
                isFavorite={favorites.includes(item._id)}
                toggleFavorite={toggleFavorite}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodDisplay;