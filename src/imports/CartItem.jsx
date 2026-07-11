import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/Cartcontext";

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty, removeFromCart } = useCart();

  return (
    <div className="grid grid-cols-[88px_1fr_auto] items-center gap-4 rounded-lg border border-[#d7b46a]/18 bg-[#fff8e8] p-4 text-[#171410] shadow-sm">
      <img src={item.photo} alt={item.name} className="h-20 w-20 rounded-md bg-white object-contain p-1" />

      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold text-[#171410]">{item.name}</h2>
        <p className="mt-1 text-base font-medium text-[#5f5544]">Rs {Number(item.price).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => decreaseQty(item.productId)} className="grid h-9 w-9 place-items-center rounded-md bg-[#eee4ce] text-[#171410] transition hover:bg-[#d7b46a]">
          <Minus size={16} />
        </button>
        <div className="grid h-9 min-w-9 place-items-center rounded-md bg-white px-2 font-semibold text-[#171410]">{item.quantity}</div>
        <button onClick={() => increaseQty(item.productId)} className="grid h-9 w-9 place-items-center rounded-md bg-[#eee4ce] text-[#171410] transition hover:bg-[#d7b46a]">
          <Plus size={16} />
        </button>
        <button onClick={() => removeFromCart(item.productId)} className="ml-2 flex items-center gap-1 rounded-md bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100">
          <Trash2 size={18} />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
