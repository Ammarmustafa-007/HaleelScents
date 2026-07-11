import React, { useRef } from "react";
import { useLocation, Link } from "react-router-dom";

export const Invoice = () => {
  const location = useLocation();
  const order = location.state?.order;
  const invoiceRef = useRef(null);

  // ❌ NO ORDER CASE
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-semibold text-gray-700">No order found!</h1>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

    const items = order.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const delivery = 250;

  // ✅ INVOICE DESIGN (invoice expands, page scrolls)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4 ">
      {/* Invoice Container */}
      <div
        ref={invoiceRef}
        className="bg-white border-4 border-gray-300 shadow-2xl rounded-xl w-full max-w-4xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-sm text-gray-500">Order ID: {order.id} </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <img src="/haleel-logo.png" alt="Logo" className="h-16 sm:h-20 rounded-md" />
        </div>

        {/* Billing Info */}
        <div className="text-sm sm:text-base mb-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Billing Information</h2>
          <p className="text-gray-700">
            {order.firstname} {order.lastname}
          </p>
          <p className="text-gray-700">{order.address}</p>
          <p className="text-gray-700">
            {order.city}, {order.country}
          </p>
          <p className="text-gray-700">Phone: {order.phone}</p>
          <p className="text-gray-700">Email: {order.email}</p>
        </div>

        {/* Order Details */}
        <div className="text-sm sm:text-base">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Details</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-1 px-2 text-left">Product</th>
                <th className="py-1 px-2 text-right">Price</th>
                <th className="py-1 px-2 text-right">Qty</th>
                <th className="py-1 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p, index) => (
                <tr key={index} className="border-b">
                  <td className="py-1 px-2">{p.name}</td>
                  <td className="py-1 px-2 text-right">Rs {p.price}</td>
                  <td className="py-1 px-2 text-right">{p.quantity || 1}</td>
                  <td className="py-1 px-2 text-right">Rs {p.price * (p.quantity || 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 border-t pt-3 text-gray-700 text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Rs { subtotal }</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>Rs {delivery}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-1">
            <span>Total:</span>
            <span>Rs {subtotal + delivery}</span>
          </div>
        </div>

        {/* Thank You */}
        <div className="text-center mt-5 pb-4">
          <p className="text-gray-600 text-sm sm:text-base">
            Thank you for shopping with{" "}
            <span className="font-semibold">Haleel Scents</span>
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <Link
          to="/"
          className="bg-[#0b0a08] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#211d17] transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
