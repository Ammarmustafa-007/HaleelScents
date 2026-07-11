import { supabase } from "../supabaseClient";

// GET ALL PRODUCTS
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;
  return data;
};

// INSERT PRODUCT
export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();

  if (error) throw error;
  return data;
};

// UPDATE PRODUCT
export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
};