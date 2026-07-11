import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const HeartsBackground = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate an array of random hearts
    const generateHearts = () => {
      return Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // horizontal start position in vw
        size: Math.random() * 15 + 10, // size between 10px and 25px
        duration: Math.random() * 8 + 6, // fall duration between 6s and 14s
        delay: Math.random() * 5, // start delay
        rotation: Math.random() * 360, // starting rotation
      }));
    };

    setHearts(generateHearts());
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            y: "-10vh",
            x: `${heart.x}vw`,
            opacity: 0,
            rotate: heart.rotation,
          }}
          animate={{
            y: "110vh",
            x: `${heart.x + (Math.random() * 10 - 5)}vw`,
            opacity: [0, 0.7, 1, 0.7, 0],
            rotate: heart.rotation + 360,
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          className="absolute text-pink-300/60 drop-shadow-sm"
          style={{ fontSize: heart.size }}
        >
          ❤
        </motion.div>
      ))}
    </div>
  );
};
