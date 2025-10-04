import React from "react";
import { FaLocationArrow } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAnimationOnce } from "../Framer/useAnimateOnce";
import { useNavigate } from "react-router-dom";

const Header = () => {
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

  const buttonStyle =
    "bg-green-500 text-amber-100 text-sm font-bold w-[120px] h-[40px] rounded-tr-full rounded-br-full cursor-pointer will-change-transform hover:scale-105 transition-all duration-100 ease-in-out";

  const hasAnimated = useAnimationOnce('header');

  return (
    <div className="pt-24 overflow-hidden w-full relative">
      <div
        className="relative z-10 flex flex-col justify-center pl-4 sm:pl-8 pb-16 pt-10 lg:mt-0 md:pt-0
        mx-4 sm:mx-8 md:mx-16 lg:mx-24 my-4 sm:my-8 rounded-2xl sm:rounded-3xl md:rounded-4xl
        lg:pl-24 items-start gap-4 w-auto min-h-[400px] sm:min-h-[450px] md:h-[600px]
        pr-4 sm:pr-10 lg:pr-28 bg-green-500/5 overflow-hidden"
      >
        {/* CARD-LIKE BACKGROUND IMAGE CONTAINER */}
        <motion.div 
          initial={hasAnimated ? false : { x: 100, opacity: 0 }}
          animate={hasAnimated ? false : { x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute mt-20 lg:mt-0 top-[55%] right-4 sm:right-8 md:right-16 lg:right-20 xl:right-32 -translate-y-1/2 -z-10"
        >
          <div
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] 
               object-contain scale-x-[-1] drop-shadow-[18px_38px_15px_rgba(0,0,0,0.3)]"
          >
            <img
              src="/chicken.png"
              alt="chicken"
              className="w-4/5 h-4/5 object-contain scale-x-[-1]
              drop-shadow-[18px_38px_15px_rgba(0,0,0,0.3)]"
            />
          </div>
        </motion.div>

        {/* LEAVES UNDER THE PLATE */}
        <motion.img
          initial={hasAnimated ? false : { x: 50, opacity: 0 }}
          animate={hasAnimated ? false : { x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          src="/leaves.png"
          alt="leaves"
          className="absolute top-[42%] right-0
             max-w-full max-h-full
             h-auto object-contain drop-shadow-[8px_16px_6px_rgba(0,0,0,0.2)] 
             -z-20 sm:-translate-y-1/2"
        />

        {/* TEXT CONTENT */}
        <motion.div
          initial={hasAnimated ? false : { y: 50, opacity: 0 }}
          animate={hasAnimated ? false : { y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3 max-w-xl mt-0 sm:mt-0 relative z-20"
        >
          <div className="bg-white/10 backdrop-blur-sm flex flex-col gap-2.5 border border-white/20 shadow-2xl w-auto mr-6 p-6 rounded-2xl">
            <motion.h2
              initial={hasAnimated ? false : { x: -100, opacity: 0 }}
              animate={hasAnimated ? false : { x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-4xl md:text-7xl font-extrabold text-green-500 
              leading-9 md:leading-16"
            >
              Good Grub,
              <br /> Chow Down.
            </motion.h2>
            <div className="drop-shadow-[0_0_12px_rgba(255,255,255,1)]">
              <motion.p
                initial={hasAnimated ? false : { x: -100, opacity: 0 }}
                animate={hasAnimated ? false : { x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-glow leading-tight text-[#2e2e2e] font-medium"
              >
                Pastries, pizzas, shawarma & more — baked fresh, made with love,
                <br /> and served just for you.
              </motion.p>
            </div>
          </div>
          <motion.div
            initial={hasAnimated ? false : { y: 50, opacity: 0 }}
            animate={hasAnimated ? false : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 relative"
          >
            <button
              onClick={handleDiveIn}
              className={`${buttonStyle} text-left pl-6 flex items-center gap-3`}
            >
              Dive in
              <span className="bg-white h-[30px] w-[30px] ml-2 rounded-full flex items-center justify-center">
                <FaLocationArrow className="scale-x-[-1] text-green-500" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;