import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import { notify } from "../components/notify";
import { BrandLoader } from "../components/BrandLoader";

export const Adminorders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, firstname, lastname, email, phone, address, city, country, postalcode, payment_method, total, status, created_at")
          .order("created_at", { ascending: false });
        if (error) throw error;

        setOrders(data);
      } catch (error) {
        console.error(error);
        notify.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Delete order

  const handleDelete = (id) => {
    notify.confirmDelete("This order and its items will be removed.", async () => {
      try {
        const { error: itemsError } = await supabase
          .from("order_items")
          .delete()
          .eq("order_id", id);

        if (itemsError) throw itemsError;

        const { error: orderError } = await supabase
          .from("orders")
          .delete()
          .eq("id", id);

        if (orderError) throw orderError;

        setOrders((prev) => prev.filter((o) => o.id !== id));
        setSelectedOrderId((prev) => (prev === id ? null : prev));
        notify.success("Order deleted successfully.");
      } catch (error) {
        notify.error(error.message || "Failed to delete order.");
      }
    });
  };

  const handleShowDetails = (id) => {
    setSelectedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-[#fff0f5] rounded-3xl min-h-screen fade-in-up">
        <h1 className="text-2xl text-gray-200 font-bold mb-6 text-center mr-3">
          🧾 Customer / Order Details
        </h1>

        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="bg-[#ffffff] text-gray-200 uppercase text-sm">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="bg-white hover:bg-gray-100 transition">
                        <td className="p-3 break-all">{order.id}</td>
                        <td className="p-3">
                          {order.firstname} {order.lastname}
                        </td>
                        <td className="p-3">
                          {new Date(order.created_at).toLocaleString()}
                        </td>

                        {/* ✅ Responsive button group */}
                        <td className="p-3 text-center">
                          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                            {/* 👁️ Show / Hide Details Button */}
                            <button
                              onClick={() => handleShowDetails(order.id)}
                              className="bg-[#db2777] cursor-pointer text-white px-3 py-1 rounded hover:bg-[#8f5832] transition w-full sm:w-auto flex items-center justify-center gap-1"
                              title={
                                selectedOrderId === order.id
                                  ? "Hide Details"
                                  : "Show Details"
                              }
                            >
                              {selectedOrderId === order.id ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>

                            {/* ✏️ Edit Button */}
                            <button
                              onClick={() =>
                                notify.info("Edit functionality is coming soon.")
                              }
                              className="bg-yellow-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-yellow-600 transition w-full sm:w-auto flex items-center justify-center"
                              title="Edit Order"
                            >
                              <Edit size={18} />
                            </button>

                            {/* 🗑️ Delete Button */}
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-700 transition w-full sm:w-auto flex items-center justify-center"
                              title="Delete Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ✅ Inline Invoice (only one open at a time) */}
                      <AnimatePresence>
                        {selectedOrderId === order.id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <td colSpan="4" className="bg-white p-4">
                              <AdminInvoice orderId={order.id} />
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ✅ Independent Invoice Component
const AdminInvoice = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);

      const [orderResult, itemsResult] = await Promise.all([
        supabase
          .from("orders")
          .select("id, firstname, lastname, email, phone, address, city, country, postalcode, payment_method, total, status, created_at")
          .eq("id", orderId)
          .single(),
        supabase
          .from("order_items")
          .select("id, order_id, name, price, quantity")
          .eq("order_id", orderId),
      ]);

      setOrder(orderResult.data);
      setItems(itemsResult.data || []);
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  // ✅ Show logo loader while fetching
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-10">
        <img
          className="h-20 w-20 animate-spin mb-3"
          src="/haleel-logo.png"
          alt="Loading"
        />
        <p className="animate-pulse text-gray-600">Loading Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-4 text-red-500">
        No order details found!
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // ✅ Once loaded, render invoice
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 sm:p-6 shadow overflow-x-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Invoice
      </h2>

      {/* Header */}
      <div className="flex justify-between items-start  border-b pb-3 mb-4 gap-3">
        <div>
          <p className="text-gray-600 break-all">Order ID: {order.id}</p>
          <p className="text-gray-600">
            Date: {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <img src="/haleel-logo.png" alt="Logo" className="h-18 sm:h-25 -mt-8" />
      </div>

      {/* Billing Info */}
      <div className="mb-4 text-sm sm:text-base">
        <h3 className="font-semibold text-gray-800 mb-2">
          Billing Information
        </h3>
        <p>
          {order.firstname} {order.lastname}
        </p>
        <p>{order.address}</p>
        <p>
          {order.city}, {order.country}
        </p>
        <p>Phone: {order.phone}</p>
        <p>Email: {order.email}</p>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-2">Product</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Qty</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2 text-right">Rs {p.price}</td>
                <td className="p-2 text-right">{p.quantity}</td>
                <td className="p-2 text-right">Rs {p.price * p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 border-t pt-3 text-sm sm:text-base">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>Rs {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>Rs 250</span>
        </div>
        <div className="flex justify-between font-semibold mt-2">
          <span>Total:</span>
          <span>Rs {subtotal + 250}</span>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs sm:text-sm mt-4">
        Thank you for shopping with{" "}
        <span className="font-semibold">Haleel Scents</span>
      </p>
    </div>
  );
};
