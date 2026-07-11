import React, { useRef, useState } from "react";
import { useCart } from "../context/Cartcontext";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { notify } from "../components/notify";

export const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  const itemCount = cart?.items?.length || 0;
  

  const [formData, setFormData] = useState({
    email: "",
    country: "",
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    postalcode: "",
    phone: "",
    whatsapp: "",
    paymentMethod: "COD",
    Totalamount:"",
  });

  const deliveryFee = 250;
  const subtotal = (cart?.items || []).reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // complete order
 const navigate = useNavigate();


const handleCompleteOrder = async (e) => {
  e.preventDefault();

  if (submitLockRef.current || isSubmitting) return;

  if (!cart?.items?.length) {
    notify.warning("Your cart is empty.");
    return;
  }

  submitLockRef.current = true;
  setIsSubmitting(true);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    submitLockRef.current = false;
    setIsSubmitting(false);
    notify.warning("Please login first to complete your order.");
    return;
  }

  try {
    // ✅ 1. Insert Order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user?.id,
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalcode: formData.postalcode,
          country: formData.country,
          payment_method: formData.paymentMethod,
          total: subtotal + deliveryFee,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // ✅ 2. Insert Order Items
    const orderItems = cart.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // ✅ 3. Success
    await clearCart();

    notify.success("Order placed successfully.");

    navigate("/invoice", {
  state: {
    order: {
      ...orderData,
      items: cart.items, // ✅ send cart items
    },
  },
});

  } catch (error) {
    console.error("ERROR:", error);
    notify.error("Order failed. Please try again.");
    submitLockRef.current = false;
    setIsSubmitting(false);
  }
};


  return (
  <div className="min-h-screen bg-ink text-ivory">
    {/* Top navbar for small screens */}
    <div className="lg:hidden bg-charcoal border-b border-gold/20 flex justify-between items-center px-4 py-3 shadow-md glass-panel sticky top-0 z-sticky">
     <Link to="/" > <img src="/haleel-logo.png" alt="Logo" className="h-14 w-36 object-contain" /></Link>
      <Link
        to="/cart"
        className="relative rounded-md border border-gold/30 px-3 py-2 transition hover:bg-gold/10 hover-lift"
      >
        <IoCartOutline className="h-7 w-7 md:h-8 md:w-8 text-gold-soft" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gold text-ink text-xs font-semibold rounded-full px-1.5 py-0.5">
            {itemCount}
          </span>
        )}
      </Link>
    </div>

    {/* ✅ WRAPPER FOR LEFT + RIGHT CONTENT */}
    <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-10 px-6 lg:px-16 py-10">
      
      {/* LEFT FORM SECTION */}
      <div className="flex-1 max-w-2xl mx-auto">
        <form
          onSubmit={handleCompleteOrder}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h2 className="text-2xl font-serif font-semibold mt-1 col-span-2 text-gold-soft">Contact</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md col-span-2 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <h2 className="text-2xl font-serif font-semibold col-span-2 text-gold-soft">Delivery</h2>
          <select
            name="country"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md col-span-2 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select Country / Region</option>
            <option value="Pakistan">Pakistan</option>
            <option value="UAE">United Arab Emirates</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="USA">USA</option>
            <option value="UK">United Kingdom</option>
          </select>

          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.lastname}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md col-span-2 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="postalcode"
            placeholder="Postal Code"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.postalcode}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="border border-gold/30 bg-charcoal p-3 text-ivory placeholder:text-ivory/50 rounded-md col-span-2 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="col-span-2 relative">
            <FaWhatsapp className="absolute left-3 top-4 text-gold-soft text-xl" />
            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp Number"
              className="w-full rounded-md border border-gold/30 bg-charcoal p-3 pl-10 text-ivory placeholder:text-ivory/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2 rounded-md border border-gold/25 bg-panel p-4 text-ivory">
            <h4 className="font-medium mb-2 text-gold-soft">Shipping Method</h4>
            <label className="flex items-center space-x-2 text-ivory/80">
              <input type="radio" checked readOnly className="accent-gold" />
              <span>Standard Delivery — Rs 250.00</span>
            </label>
          </div>

          <div className="col-span-2">
            <h4 className="text-lg mb-2 text-gold-soft">Payment Method</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <label
                className={`flex-1 border-2 rounded-lg p-4 cursor-pointer text-center transition ${
                  formData.paymentMethod === "COD"
                    ? "border-gold bg-gold/10 text-gold-soft"
                    : "border-gold/20 bg-charcoal text-ivory/70 hover:border-gold/50 hover:bg-gold/5"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  className="hidden"
                  checked={formData.paymentMethod === "COD"}
                  onChange={handleChange}
                />
                <span className="font-medium block">Cash on Delivery</span>
              </label>

              <label
                className={`flex-1 border-2 rounded-lg p-4 cursor-pointer text-center transition ${
                  formData.paymentMethod === "BANK"
                    ? "border-gold bg-gold/10 text-gold-soft"
                    : "border-gold/20 bg-charcoal text-ivory/70 hover:border-gold/50 hover:bg-gold/5"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK"
                  className="hidden"
                  checked={formData.paymentMethod === "BANK"}
                  onChange={handleChange}
                />
                <span className="font-medium block">
                  Bank Transfer (Easypaisa / JazzCash)
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="col-span-2 haleel-gold-button py-3 rounded-md mt-4 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
            {isSubmitting ? "Placing order..." : "Complete Order"}
          </button>
        </form>
      </div>

      {/* RIGHT SUMMARY SECTION */}
      <div className="flex-1 lg:w-[40%] bg-panel text-ivory shadow-lg p-6 rounded-lg mt-10 lg:mt-0 border border-gold/20">
        <div className="hidden lg:flex justify-between items-center mb-10">
            <Link to="/" > <img src="/haleel-logo.png" alt="Logo" className="h-20 w-44 object-contain" /></Link>
          <Link
            to="/cart"
            className="relative border border-gold/30 text-gold-soft px-3 py-2 rounded-md hover:bg-gold/10 transition hover-lift"
          >
            <IoCartOutline className="h-7 w-7 md:h-8 md:w-8" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-xs font-semibold rounded-full px-1.5 py-0.5">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <h3 className="text-lg font-serif font-semibold mb-6 text-gold-soft">Your Items</h3>
        <div className="space-y-4 mb-6">
          {!cart || (cart.items || []).length === 0 ? (
            <p className="text-ivory/60">No items in cart</p>
          ) : (
            cart.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b border-gold/15 pb-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="h-14 w-14 rounded bg-ink object-contain p-1 border border-gold/10"
                  />
                  <span className="line-clamp-2 text-sm font-medium text-ivory">{item.name}</span>
                </div>
                <span className="text-gold-soft">Rs {item.price}</span>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gold/20 pt-4 text-ivory/80 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Rs {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>Rs {deliveryFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg text-gold pt-2">
            <span>Total:</span>
            <span>Rs {total}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};
