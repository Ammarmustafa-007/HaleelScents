import React from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/notify";

export const Adminpcard = ({
  id = "",
  photo = "",
  name = "",
  price = "",
  gender = "",
  occasion = "",
  notes = "",
  accords = "",
  category = "",
  product_tag = "",
  image_path = "",
  refresh,
}) => {

  const navigate = useNavigate();

  // DELETE PRODUCT
  const delbtn = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

          // 🔥 DELETE IMAGE FROM BUCKET
    if (image_path) {

      await supabase.storage
        .from("products")
        .remove([image_path]);
    }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      notify.success("Product deleted successfully.");

      if (refresh) refresh();

    } catch (err) {

      console.error(err.message);
      notify.error(err.message || "Failed to delete product.");

    }
  };

  return (

    <div className="bg-white rounded-xl shadow-md overflow-hidden p-3">

      {/* IMAGE */}
      <div className="h-52 overflow-hidden rounded-lg">

        <img
          src={photo}
          alt={name}
          className="w-full h-full object-contain"
        />

      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-2">

        <h2 className="text-xl font-bold">
          {name}
        </h2>

        <p className="font-semibold text-lg">
          Rs. {price}
        </p>

        <div className="text-sm text-gray-600 space-y-1">

          <p>
            <span className="font-semibold">
              Category:
            </span> {category}
          </p>

          <p>
            <span className="font-semibold">
              Tag:
            </span> {product_tag || "None"}
          </p>

          <p>
            <span className="font-semibold">
              Gender:
            </span> {gender}
          </p>

          <p>
            <span className="font-semibold">
              Occasion:
            </span> {occasion}
          </p>

          <p>
            <span className="font-semibold">
              Notes:
            </span> {notes}
          </p>

          <p>
            <span className="font-semibold">
              Accords:
            </span> {accords}
          </p>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-3">

          <button
            onClick={() => navigate(`/admin/products/edit/${id}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 
                       text-white py-2 rounded-lg"
          >
            Edit
          </button>

          <button
            onClick={delbtn}
            className="w-full bg-red-600 hover:bg-red-700 
                       text-white py-2 rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};
