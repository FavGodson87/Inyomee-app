import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";


export const fadeIn = {
  initial: { opacity: 0 },
  animate: (custom = {}) => ({
    opacity: 1,
    transition: { delay: custom.delay || 0 },
  }),
 
};

export const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: (custom = {}) => ({
    x: 0,
    opacity: 1,
    transition: { delay: custom.delay || 0 },
  }),
  
};

export const scale = {
  initial: { scale: 0.8, opacity: 0 },
  animate: (custom = {}) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: custom.delay || 0 },
  }),

};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Basic animated component
export const AnimatedBox = ({
  children,
  variant = fadeIn,
  custom,
  ...props
}) => (
  <motion.div
    variants={variant}
    initial="initial"
    animate="animate"
    custom={custom}
    {...props}
  >
    {children}
  </motion.div>
);

// Page transition component
export const PageTransition = ({ children, key }) => {
  const [animateOnLoad, setAnimateOnLoad] = useState(false);

  useEffect(() => {
    const freshLoad = performance.getEntriesByType("navigation")[0].type === "reload";
    setAnimateOnLoad(freshLoad);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={animateOnLoad ? { opacity: 0, y: 20 } : false}
        animate={animateOnLoad ? { opacity: 1, y: 0 } : false}
        exit={animateOnLoad ? { opacity: 0, y: -20 } : false}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};


// Hover animation component
export const HoverCard = ({ children }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      y: -5,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300 }}
    style={{
      padding: "20px",
      background: "white",
      borderRadius: "10px",
      cursor: "pointer",
    }}
  >
    {children}
  </motion.div>
);

// Loading spinner component
export const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    style={{
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3498db",
      borderRadius: "50%",
    }}
  />
);

// Staggered list component
export const StaggeredList = ({ items }) => (
  <motion.ul variants={staggerContainer} initial="initial" animate="animate">
    {items.map((item, index) => (
      <motion.li
        key={index}
        variants={fadeIn}
        style={{ margin: "10px 0", listStyle: "none" }}
      >
        {item}
      </motion.li>
    ))}
  </motion.ul>
);

// Modal with backdrop
export const AnimatedModal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25 }}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 1001,
            minWidth: "300px",
          }}
        >
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Usage example component
export const ExampleUsage = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

  useEffect(() => {
    const freshLoad =
      performance.getEntriesByType("navigation")[0].type === "reload";
    setAnimateOnLoad(freshLoad);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Framer Motion Examples</h1>

      {/* Toggle visibility */}
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle Visibility
      </button>

      <AnimatePresence>
        {isVisible && (
          <AnimatedBox
            style={{
              padding: "20px",
              background: "#f0f0f0",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            This content fades in and out
          </AnimatedBox>
        )}
      </AnimatePresence>

      {/* Hover card */}
      <HoverCard>
        <h3>Hover over me!</h3>
        <p>I'll lift up and scale slightly</p>
      </HoverCard>

      {/* Staggered list */}
      <div style={{ marginTop: "20px" }}>
        <h3>Staggered List</h3>
        <StaggeredList items={items} />
      </div>

      {/* Loading spinner */}
      <div style={{ marginTop: "20px" }}>
        <LoadingSpinner />
      </div>

      {/* Page navigation */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setCurrentPage(1)}>Page 1</button>
        <button onClick={() => setCurrentPage(2)}>Page 2</button>

        <PageTransition key={currentPage}>
          <div
            style={{
              padding: "20px",
              background: "#e0e0e0",
              marginTop: "10px",
            }}
          >
            {currentPage === 1 ? "Page 1 Content" : "Page 2 Content"}
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default {
  motion,
  AnimatePresence,
  fadeIn,
  slideIn,
  scale,
  staggerContainer,
  AnimatedBox,
  PageTransition,
  HoverCard,
  LoadingSpinner,
  StaggeredList,
  AnimatedModal,
  ExampleUsage,
};
