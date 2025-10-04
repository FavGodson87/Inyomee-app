import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = {};

const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // "PUSH" | "POP" | "REPLACE"

  useEffect(() => {
    if (navigationType === "POP" && scrollPositions[location.key]) {
      // 👈 restore scroll only when going BACK
      window.scrollTo(0, scrollPositions[location.key]);
    } else {
      // 👈 on forward nav or fresh visit, go to top
      window.scrollTo(0, 0);
    }

    return () => {
      // store current scroll before leaving
      scrollPositions[location.key] = window.scrollY;
    };
  }, [location, navigationType]);

  return null;
};

export default ScrollRestoration;
