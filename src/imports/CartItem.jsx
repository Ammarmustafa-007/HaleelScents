import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/Cartcontext";

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty, removeFromCart } = useCart();

  return (
    <div className="grid grid-cols-[88px_1fr_auto] items-center gap-4 rounded-lg border border-[#f472b6]/30 bg-[#fce7f3] p-4 shadow-sm transition hover:shadow-md">
      <img src={item.photo} alt={item.name} className="h-20 w-20 rounded-md bg-white object-contain p-1 border border-[#f472b6]/20" />

      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-[#db2777]">{item.name}</h2>
        <p className="mt-1 text-base font-semibold text-[#ec4899]">Rs {Number(item.price).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => decreaseQty(item.productId)} className="grid h-9 w-9 place-items-center rounded-md bg-[#fbcfe8] text-[#db2777] font-bold transition hover:bg-[#f472b6] hover:text-white">
          <Minus size={16} strokeWidth={3} />
        </button>
        <div className="grid h-9 min-w-9 place-items-center rounded-md bg-white px-2 font-bold text-[#db2777] shadow-inner">{item.quantity}</div>
        <button onClick={() => increaseQty(item.productId)} className="grid h-9 w-9 place-items-center rounded-md bg-[#fbcfe8] text-[#db2777] font-bold transition hover:bg-[#f472b6] hover:text-white">
          <Plus size={16} strokeWidth={3} />
        </button>
        <button onClick={() => removeFromCart(item.productId)} className="ml-2 flex items-center gap-1 rounded-md bg-[#f472b6]/10 px-3 py-2 font-semibold text-[#db2777] transition hover:bg-[#f472b6] hover:text-white">
          <Trash2 size={18} />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
