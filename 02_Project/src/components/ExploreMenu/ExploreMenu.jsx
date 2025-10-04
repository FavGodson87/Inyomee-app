import React, { useRef } from "react";
import { motion } from "framer-motion";
import "./ExploreMenu.css";
import { MdExplore } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { menuList } from "../../assets/assets";
import { useAnimationOnce } from "../Framer/useAnimateOnce";

const ExploreMenu = ({ category, setCategory }) => {
  const scrollRef = useRef(null);
  const hasAnimated = useAnimationOnce("explore-menu");

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 160;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // helper to simplify motion props
  const motionProps = (delay = 0) => ({
    initial: hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    whileInView: hasAnimated ? {} : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  });

  return (
    <div
      className="w-full px-10 lg:px-16 md:px-0 sm:px-0 pt-10"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      id="explore-menu"
    >
      <div className="flex flex-col w-full lg:max-w-full gap-1 sm:px-10 py-4">
        {/* Heading */}
        <motion.div
          {...motionProps(0)}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1">
            <MdExplore className="animate-spin-slow text-[28px] mb-2 text-green-500" />
            <motion.h1
              {...motionProps(0.2)}
              className="text-[25px] sm:text-[25px] md:text-[30px] lg:text-[30px] font-bold text-[#2e2e2e]"
            >
              Explore the Goodies
            </motion.h1>
          </div>
          <motion.p
            {...motionProps(0.3)}
            className="max-w-[590px] text-[#2e2e2e] text-center"
          >
            Goodies aren't just food, they're little moments of joy… come find
            yours today. 
          </motion.p>
        </motion.div>

        {/* Scrollable Menu */}
        <div className="relative w-full flex justify-center">
          {/* Left Arrow */}
          <motion.button
            {...motionProps(0.4)}
            onClick={() => scroll("left")}
            className="absolute left-1 sm:left-10 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10"
          >
            <FaChevronLeft className="text-green-500" />
          </motion.button>

          {/* Icons viewport */}
          <motion.div
            {...motionProps(0.3)}
            ref={scrollRef}
            className="flex overflow-x-scroll hide-scrollbar scroll-smooth gap-4 w-[500px] p-4 sm:w-[600px] md:w-[700px] lg:w-[800px]"
          >
            {menuList.map((item, index) => {
              const Icon = item.menu_icon;
              const isActive = category === item.menu_name;

              return (
                <motion.div
                  key={index}
                  initial={
                    hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }
                  }
                  whileInView={hasAnimated ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex-shrink-0 w-[150px] text-center"
                >
                  <div
                    onClick={() =>
                      setCategory((prev) =>
                        prev === item.menu_name ? "All" : item.menu_name
                      )
                    }
                    className={`
                      flex flex-col items-center justify-center gap-2 mt-8 
                      w-[100px] h-[120px] rounded-2xl cursor-pointer
                      transition-transform duration-200 ease-in-out hover:-translate-y-2
                      ${isActive ? "bg-green-500" : "bg-green-100"}  // This line was missing
                    `}
                  >
                    <Icon
                      className={`text-5xl ${
                        isActive ? "text-white" : "text-green-500"
                      }`}
                    />
                    <p
                      className={`font-bold ${
                        isActive ? "text-white" : "text-[#2e2e2e]"
                      }`}
                    >
                      {item.menu_name}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Arrow */}
          <motion.button
            {...motionProps(0.4)}
            onClick={() => scroll("right")}
            className="absolute sm:right-10 right-1 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10"
          >
            <FaChevronRight className="text-green-500" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ExploreMenu;
