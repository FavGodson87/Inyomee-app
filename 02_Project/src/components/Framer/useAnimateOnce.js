// useAnimateOnce.js
import { useState, useEffect } from 'react';

const animatedFlags = {}; // persists across navigations

export const useAnimationOnce = (key) => {
  const [hasAnimated, setHasAnimated] = useState(animatedFlags[key] || false);

  useEffect(() => {
    if (!animatedFlags[key]) {
      animatedFlags[key] = true; // mark as animated
      setHasAnimated(false);      // run animation
    } else {
      setHasAnimated(true);       // skip animation
    }
  }, [key]);

  return hasAnimated;
};
