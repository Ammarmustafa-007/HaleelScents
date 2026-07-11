// AddProduct.jsx

import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/notify";

export const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    product_tag: "",
    details: {
      gender: "",
      occasion: "",
      notes: "",
      accords: "",
    },
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["gender", "occasion", "notes", "accords"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // IMAGE UPLOAD
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.log(error.message);
      notify.error(error.message);
      return null;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);

    return {
      publicUrl: data.publicUrl,
      path: fileName,
    };
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    let uploadedImage = null;

    if (imageFile) {
      uploadedImage = await uploadImage(imageFile);

      if (!uploadedImage) {
        setLoading(false);
        return;
      }
    }

    const newProduct = {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      photo: uploadedImage?.publicUrl || "",
      image_path: uploadedImage?.path || "",
      details: formData.details,
    };

    const { error } = await supabase.from("products").insert([newProduct]);

    setLoading(false);

    if (error) {
      console.log(error.message);
      notify.error(error.message);
      return;
    }

    notify.success("Product added successfully.");

    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="category"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select Category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="elevate">Elevate Series</option>
            <option value="100ml">100 ML</option>
          </select>

          <select
            name="product_tag"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">All Products</option>

            <option value="top_seller">Top Seller</option>

            <option value="featured">Featured</option>

            <option value="trending">Trending</option>

            <option value="new_arrival">New Arrival</option>
          </select>

          <select
            name="gender"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="BOTH">Both</option>
          </select>

          <input
            type="text"
            name="occasion"
            placeholder="Occasion"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="notes"
            placeholder="Notes"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="accords"
            placeholder="Fragrance Accords"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-blue-600"
            >
              {loading ? "Adding product..." : "Add Product"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/admin/products")}
              className="w-full bg-gray-300 py-3 rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
