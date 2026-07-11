import React from "react";
import { brand } from "../brand";
import { motion } from "framer-motion";

export const BrandLoader = ({ label = "Preparing your experience...", fullscreen = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${fullscreen ? "fixed inset-0 z-[99999] bg-[#fff0f5]" : "p-12"}`}>
      
      <div className="relative flex items-center justify-center">
        {/* Glowing aura rings */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-28 w-28 rounded-full border-2 border-[#f472b6] bg-[#f472b6]/20 shadow-[0_0_40px_rgba(244,114,182,0.6)]"
        />
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute h-28 w-28 rounded-full border border-[#f472b6] bg-[#f472b6]/5"
        />

        {/* Floating Logo Container */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 h-28 w-28 rounded-full border-[3px] border-white/50 bg-[#222222] shadow-2xl overflow-hidden flex items-center justify-center"
        >
          <img className="h-full w-full object-contain scale-[1.15]" src={brand.logo} alt={brand.name} />
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[#db2777] font-serif font-bold tracking-[0.1em] text-lg mt-6 text-center drop-shadow-sm"
      >
        {label}
      </motion.p>
    </div>
  );
};
