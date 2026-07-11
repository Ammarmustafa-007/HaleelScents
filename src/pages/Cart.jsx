import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import CartItem from "../imports/CartItem";
import { useCart } from "../context/Cartcontext";
import { Trash2 } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

export const Cart = () => {
  const { cart, clearCart } = useCart();
  const items = cart?.items || [];
  const [isClearing, setisClearing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClear = async () => {
    if (isClearing || items.length === 0) return;
    setisClearing(true);
    try {
      await clearCart();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1200);
    } finally {
      setisClearing(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0,
  );

  return (
    <main className="min-h-screen bg-ink text-ivory">
      <Navbar />

      {items.length > 0 && (
        <button
          onClick={handleClear}
          disabled={isClearing}
          className="fixed right-5 top-28 z-toast flex h-12 min-w-[150px] items-center justify-center gap-2 rounded-full bg-red-600 px-5 font-semibold text-white shadow-2xl transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 hover-lift"
        >
          {isSuccess ? (
            <DotLottieReact src="/animations/Delete.lottie" loop={false} autoplay style={{ width: 36, height: 36 }} />
          ) : (
            <>
              <Trash2 size={18} />
              <span>{isClearing ? "Clearing..." : "Clear Cart"}</span>
            </>
          )}
        </button>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10">
        <div className="mb-8 pr-44">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Your selection</p>
          <h1 className="mt-3 text-4xl font-serif font-semibold">Cart</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="min-h-[420px] rounded-lg border border-gold/15 bg-charcoal p-4">
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex h-[420px] flex-col items-center justify-center text-ivory/60">
                <Trash2 size={48} className="mb-4 opacity-30" />
                <p>Your cart is empty.</p>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-lg border border-gold/20 bg-charcoal p-6 shadow-2xl">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>Rs {subtotal.toFixed(2)} PKR</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-ivory/70">
              Delivery fee appears at checkout in the final bill.
            </p>
            <div className="mt-8 flex justify-between border-t border-gold/20 pt-5 text-xl font-semibold">
              <span>Estimated total</span>
              <span>Rs {subtotal.toFixed(2)} PKR</span>
            </div>

            <Link
              to="/checkout"
              className={`haleel-gold-button mt-7 block w-full rounded-full py-3 text-center text-lg font-bold transition ${items.length === 0 ? "pointer-events-none opacity-50" : "hover-lift"}`}
            >
              Proceed to Checkout
            </Link>

            <div className="mt-5 text-center text-sm text-ivory/70">
              or{" "}
              <Link to="/" className="font-semibold text-gold-soft underline-offset-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};
