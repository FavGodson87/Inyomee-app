import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { GiWaterSplash } from "react-icons/gi";
import FoodItem from "../FoodItem/FoodItem";
import { motion } from "framer-motion";
import { useAnimationOnce } from "../Framer/useAnimateOnce";

const FoodDisplay = ({ category, searchQuery = "" }) => {
  const { foodList, favorites, toggleFavorite } = useContext(StoreContext);
  const hasAnimated = useAnimationOnce("food-display");

  // Filter food first
  const filteredFood = foodList.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by category
  const groupedByCategory = filteredFood.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const motionProps = (delay = 0) => ({
    initial: hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    whileInView: hasAnimated ? {} : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  });

  return (
    <div
      className="pt-0 w-full px-6 md:px-12 lg:px-20 overflow-x-hidden -mt-4"
      id="food-display"
    >
      <motion.h2
  {...motionProps(0)}
  className=""
>
  {/* Tasty Picks */}
  <motion.span
    initial={hasAnimated ? { scale: 1 } : { scale: 0 }}
    whileInView={hasAnimated ? {} : { scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
  >
    {/* <GiWaterSplash className="mt-0.5 text-green-500" /> */}
  </motion.span>
</motion.h2>

      {/* Render each category */}
      <div className="space-y-14 mt-10">
        {Object.entries(groupedByCategory).map(([catName, items], catIndex) => (
          <motion.section key={catName} {...motionProps(catIndex * 0.1)}>
            {/* Category heading */}
            <h3 className="text-[22px] font-bold text-gray-800 mb-3 px-2">
              {catName}
            </h3>

            {/* Items container */}
            <div
              className="
                flex gap-5 overflow-x-auto scroll-smooth pb-4
                md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-8 md:overflow-visible
              "
            >
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={
                    hasAnimated
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.9 }
                  }
                  whileInView={hasAnimated ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="flex-shrink-0
                  w-[240px] sm:w-[260px] md:w-auto
                  h-[340px] md:h-auto
                  scroll-snap-align-start"
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
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
