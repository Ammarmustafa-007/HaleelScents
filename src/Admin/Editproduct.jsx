import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { notify } from "../components/notify";

export const Editproduct = ({ product, refresh, onCancel }) => { 
  const [photo, setPhoto] = useState(product?.photo || "");
  const [name, setName] = useState(product?.name || ""); 
  const [price, setPrice] = useState(product?.price || ""); 
  const [gender, setGender] = useState(product?.gender || "");
  const [occasion, setOccasion] = useState(product?.occasion || "");
  const [notes, setNotes] = useState(product?.notes || "");
  const [accords, setAccords] = useState(product?.accords || ""); 
  const [category, setCategory] = useState(product?.catagory || "");

  // 🔹 Build the final object exactly as backend expects
  const buildFormData = () => ({
    id: product.id, // keep id and other unchanged fields
    photo,
    name,
    price,
    details: {
      gender,
      occasion,
      notes,
      accords,
    },
    category,
  });

  // 🔹 API Update
const editdetails = async () => {
  const formData = buildFormData();

  const { error } = await supabase
    .from("products")
    .update({
      photo: formData.photo,
      name: formData.name,
      price: formData.price,
      details: formData.details,
      category: formData.category,
    })
    .eq("id", product.id);

  if (error) {
    console.log("Update Error:", error.message);
    notify.error(error.message);
    return false;
  }

  return true;
};

  // 🔹 Handle Save
  const handleSave = async () => {
    
    const ok = await editdetails(); // wait for backend
    if (ok) {
  if (refresh) refresh();

  notify.success("Product updated successfully.");

  setTimeout(() => {
    onCancel();
  }, 700);
}
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Edit Product
        </h2>

        {/* Inputs with labels */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">-Select Gender-</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">Women</option>
              <option value="UNISEX">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occasion
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fragrance Accords
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={accords}
              onChange={(e) => setAccords(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="catagory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">-- Select Category --</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="elevate">Elevate Series</option>
              <option value="100ml">100 ML Perfumes</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
