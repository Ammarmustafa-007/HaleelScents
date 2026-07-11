// Editproductpage.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../components/notify";

export const Editproductpage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  // FETCH PRODUCT
  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, category, product_tag, photo, image_path, details")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error.message);
      notify.error(error.message);
    } else {
      setProduct(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["gender", "occasion", "notes", "accords"].includes(name)
    ) {
      setProduct((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [name]: value,
        },
      }));
    } else {
      setProduct((prev) => ({
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

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return {
        publicUrl: data.publicUrl,
        path: fileName,
    };
  };

  // UPDATE PRODUCT
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (saving) return;
    setSaving(true);

    let imageUrl = product.photo;
    let uploadedImage = null;

if (imageFile) {

  // DELETE OLD IMAGE
  if (product.image_path) {

    await supabase.storage
      .from("products")
      .remove([product.image_path]);
  }

  // UPLOAD NEW IMAGE
  uploadedImage = await uploadImage(imageFile);

  if (!uploadedImage) {
    setSaving(false);
    return;
  }

  imageUrl = uploadedImage.publicUrl;
}

    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        price: product.price,
        category: product.category,
        product_tag: product.product_tag,
        photo: imageUrl,
        image_path: uploadedImage?.path || product.image_path,
        details: product.details,
      })
      .eq("id", id);

    if (error) {
      console.log(error.message);
      notify.error(error.message);
      setSaving(false);
      return;
    }

    notify.success("Product updated successfully.");

    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Edit Product
        </h2>

        <form
          onSubmit={handleUpdate}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="elevate">Elevate</option>
            <option value="100ml">100 ML</option>
          </select>

          <select
            name="product_tag"
            value={product.product_tag || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Tag</option>
            <option value="top_seller">Top Seller</option>
            <option value="featured">Featured</option>
            <option value="trending">Trending</option>
            <option value="new_arrival">New Arrival</option>
          </select>

          <select
            name="gender"
            value={product.details?.gender || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="UNISEX">Unisex</option>
          </select>

          <input
            type="text"
            name="occasion"
            value={product.details?.occasion || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="notes"
            value={product.details?.notes || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="accords"
            value={product.details?.accords || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <div className="flex gap-4">

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Updating product..." : "Update Product"}
            </button>

            <button
              type="button"
              disabled={saving}
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
