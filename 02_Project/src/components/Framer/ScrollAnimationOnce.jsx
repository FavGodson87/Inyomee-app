import { motion } from "framer-motion";
import { useAnimationOnce } from "./useAnimateOnce";

const ScrollAnimateOnce = ({ children, animationKey, className, style }) => {
  const hasAnimated = useAnimationOnce(animationKey);

  return (
    <motion.div
      // If already animated, show fully visible
      initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      // Animate only if not yet animated
      whileInView={hasAnimated ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimateOnce;
