import { useState, useEffect , createContext } from 'react'
import { supabase } from "../supabaseClient";

export const ProductproviderContext=createContext();

export const Productprovider = ({children}) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // const getproducts = async () => {
    // const url = "http://192.168.18.57:3000/products";
    // let response = await fetch(url);
    // response = await response.json();
    // setproddata(response);
    // console.log("Dataincomming" , proddata);
    
  // };
const getproducts = async () => {
  setLoading(true);
  setErrorMessage("");

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, category, photo, image_path, product_tag, details, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("❌ Error fetching products:", error);
    setErrorMessage(error.message);
    setProducts([]);
  } else {
    setProducts(data || []);
  }

  setLoading(false);
};

//   

   useEffect(() => {
    getproducts();
  }, []);

// json-server --watch db.json --host 192.168.18.41 --port 5000  ofc

// json-server --watch cart.json --host 192.168.18.41 --port 5001
// json-server --watch orders.json --host 192.168.18.41 --port 5002


// json-server --watch db.json --host 192.168.1.8 --port 5000 karr



  return (

    <>
     {/* <div>PRODUCT PROVIDER IS WORKING</div> */}

    <ProductproviderContext.Provider
      value={{
        products,
        loading,
        errorMessage,
        refreshProducts: getproducts,
      }}
    >

      {children}

    </ProductproviderContext.Provider>

    
    
    </>

   



  )
}
