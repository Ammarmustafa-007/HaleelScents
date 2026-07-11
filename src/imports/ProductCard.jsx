import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingBag, X } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/Cartcontext";
import { notify } from "../components/notify";

export const ProductCard = ({
  id = "",
  photo = "",
  name = "",
  price = "",
  gender = "",
  occasion = "",
  notes = "",
  accords = "",
  category = "",
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addtocart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const product = { id, photo, name, price, gender, occasion, notes, accords, category };

  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showDetails]);

  const handleAdd = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addtocart(product);
      setIsSuccess(true);
      notify.success(`${name} added to cart.`);
      setTimeout(() => setIsSuccess(false), 1200);
    } finally {
      setIsAdding(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {showDetails && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
            className="absolute inset-0 bg-[#0b0a08]/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#d7b46a]/30 bg-gradient-to-b from-[#171410] to-[#0b0a08] shadow-[0_0_50px_rgba(215,180,106,0.15)]"
          >
            <button
              onClick={() => setShowDetails(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-[#0b0a08]/50 p-2 text-[#fff8e8] backdrop-blur-sm transition hover:bg-[#d7b46a]/20 hover:text-[#d7b46a]"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d7b46a]">{category || "Haleel"}</p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-[#fff8e8]">{name}</h3>
              
              <div className="mt-6 space-y-4 text-sm">
                <div className="border-b border-[#d7b46a]/10 pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d7b46a]/70">Gender</p>
                  <p className="mt-1 text-[#fff8e8]/90">{gender || "Signature"}</p>
                </div>
                <div className="border-b border-[#d7b46a]/10 pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d7b46a]/70">Occasion</p>
                  <p className="mt-1 text-[#fff8e8]/90">{occasion || "Everyday luxury"}</p>
                </div>
                <div className="border-b border-[#d7b46a]/10 pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d7b46a]/70">Notes</p>
                  <p className="mt-1 text-[#fff8e8]/90 leading-relaxed">{notes || "Warm, polished, memorable"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d7b46a]/70">Accords</p>
                  <p className="mt-1 text-[#fff8e8]/90 leading-relaxed">{accords || "Premium blend"}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0b0a08] p-4 border-t border-[#d7b46a]/20">
               <button
                  className="haleel-gold-button flex h-12 w-full items-center justify-center rounded-md text-sm font-bold uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={(e) => {
                     e.stopPropagation();
                     handleAdd();
                  }}
                  disabled={isAdding}
                >
                  {isSuccess ? (
                    <DotLottieReact src="/animations/success.lottie" loop={false} autoplay style={{ width: 34, height: 34 }} />
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingBag size={18} />
                      {isAdding ? "Adding to Cart" : `Add to Cart - Rs ${price}`}
                    </span>
                  )}
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <article className="group relative mx-auto my-3 flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-lg border border-[#d7b46a]/20 bg-[#0b0a08] text-[#fff8e8] shadow-lg transition duration-500 hover:border-[#d7b46a]/45 hover-lift">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/70 to-transparent" />

        <div className="relative m-3 h-[280px] shrink-0 overflow-hidden rounded-md bg-[#171410]">
          <img className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-105" src={photo} alt={name} />
          <span className="absolute left-3 top-3 rounded-full border border-[#d7b46a]/30 bg-[#0b0a08]/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#d7b46a] backdrop-blur-md">
            {category || "Haleel"}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
          <h3 className="min-h-[56px] text-lg font-serif font-semibold leading-7 tracking-wide text-[#fff8e8] line-clamp-2">
            {name}
          </h3>
          <p className="mt-1 text-2xl font-bold text-[#d7b46a]">Rs {price}</p>

          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="mt-4 mb-4 h-10 w-full rounded-md border border-[#d7b46a]/20 text-xs font-semibold uppercase tracking-[0.16em] text-[#fff8e8]/80 transition hover:bg-[#d7b46a]/10 hover-lift"
          >
            Reveal Details
          </button>

          <button
            className="haleel-gold-button mt-auto flex h-11 w-full shrink-0 items-center justify-center rounded-md px-4 text-sm font-bold uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleAdd}
            disabled={isAdding}
          >
            {isSuccess ? (
              <DotLottieReact src="/animations/success.lottie" loop={false} autoplay style={{ width: 34, height: 34 }} />
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingBag size={17} />
                {isAdding ? "Adding" : "Add to Cart"}
              </span>
            )}
          </button>
        </div>
      </article>

      {/* RENDER MODAL VIA PORTAL TO PREVENT Z-INDEX/TRANSFORM CLIPPING */}
      {createPortal(modalContent, document.body)}
    </>
  );
};
