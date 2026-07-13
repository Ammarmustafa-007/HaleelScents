import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export const AnimatedRoute = ({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        transitionEnd: { filter: "none", transform: "none" }
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full min-h-screen flex flex-col"
    >
      {children}

      {/* commit example */}
    </motion.div>
  );
};
