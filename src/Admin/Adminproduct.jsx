// Adminproduct.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Adminpcard } from "./Adminpcard";
import { useNavigate, useLocation } from "react-router-dom";

export const Adminproduct = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  let filter = null;

  if (location.pathname.includes("top-sellers")) {
    filter = "top_seller";
  }

  if (location.pathname.includes("new-arrivals")) {
    filter = "new_arrival";
  }

  // FETCH PRODUCTS
const fetchProducts = async () => {
  setLoading(true);
  setErrorMessage("");

  let query = supabase
    .from("products")
    .select("id, name, price, category, photo, image_path, product_tag, details, created_at");

  if (filter) {
    query = query.eq("product_tag", filter);
  }

  const { data, error } = await query.order(
    "created_at",
    { ascending: false }
  );

  if (error) {
    setErrorMessage(error.message);
    setProducts([]);
  } else {
    setProducts(data || []);
  }

  setLoading(false);
};

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <img className="h-20 w-20 animate-spin" src="/haleel-logo.png" alt="Loading" />
        <p className="mt-4 animate-pulse text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">

        <h2 className="text-3xl font-bold">
          Products
        </h2>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-[#a86b3c] hover:bg-[#8f5832] text-white px-6 py-3 rounded-lg"
        >
          Add Product
        </button>

      </div>

      {/* PRODUCTS GRID */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-red-600">
          Unable to load products: {errorMessage}
        </div>
      )}

      {!errorMessage && products.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800">
            No products are available right now.
          </h3>
          <p className="mt-2 text-gray-500">
            Add your first product to start filling the catalogue.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/products/add")}
            className="mt-6 rounded-md bg-[#a86b3c] px-5 py-2 text-white transition hover:bg-[#8f5832]"
          >
            Add Product
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {products.map((p) => (

          <Adminpcard
            key={p.id}
            id={p.id}
            photo={p.photo}
            name={p.name}
            price={p.price}
            gender={p.details?.gender}
            occasion={p.details?.occasion}
            notes={p.details?.notes}
            accords={p.details?.accords}
            category={p.category}
            product_tag={p.product_tag}
            image_path={p.image_path}
            refresh={fetchProducts}
          />

        ))}

      </div>
    </div>
  );
};
