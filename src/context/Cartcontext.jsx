import { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

const GUEST_CART_KEY = "haleelscents_guest_cart";

const createGuestCart = (items = []) => ({
  id: "guest",
  deviceId: localStorage.getItem("deviceId"),
  userId: null,
  items,
});

const getGuestCart = () => {
  try {
    const savedCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "null");
    return savedCart?.items ? savedCart : createGuestCart();
  } catch {
    return createGuestCart();
  }
};

const saveGuestCart = (cart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

const mergeCartItems = (baseItems = [], incomingItems = []) => {
  const merged = [...baseItems];

  incomingItems.forEach((item) => {
    const existing = merged.find((p) => p.productId === item.productId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
    } else {
      merged.push(item);
    }
  });

  return merged;
};

export const cartContext = createContext(null);

export const CartContext = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const { user } = useAuth();

  // ---- Setup deviceId once ----
  useEffect(() => {
    const initCart = async () => {
      let storedId = localStorage.getItem("deviceId");
      if (!storedId) {
        storedId = uuidv4();
        localStorage.setItem("deviceId", storedId);
      }
      setDeviceId(storedId);

      const guestCart = getGuestCart();

      if (!user?.id) {
        setCart(guestCart);
        return;
      }

      const { data, error } = await supabase
        .from("carts")
        .select("id, deviceId, userId, items")
        .eq("userId", user.id)
        .limit(1);

      if (error) {
        console.log("❌ Error fetching cart:", error.message);
        setCart(guestCart);
        return;
      }

      const existingCart = data?.[0];
      const guestItems = guestCart.items || [];

      if (existingCart) {
        if (guestItems.length > 0) {
          const mergedItems = mergeCartItems(existingCart.items || [], guestItems);
          const { data: updatedCart, error: updateError } = await supabase
            .from("carts")
            .update({ items: mergedItems })
            .eq("id", existingCart.id)
            .select("id, deviceId, userId, items")
            .single();

          if (!updateError) {
            localStorage.removeItem(GUEST_CART_KEY);
            setCart(updatedCart);
            return;
          }
        }

        setCart(existingCart);
        return;
      }

      if (guestItems.length > 0) {
        const { data: newCart, error: insertError } = await supabase
          .from("carts")
          .insert([
            {
              deviceId: storedId,
              userId: user.id,
              items: guestItems,
            },
          ])
          .select("id, deviceId, userId, items")
          .single();

        if (!insertError) {
          localStorage.removeItem(GUEST_CART_KEY);
          setCart(newCart);
          return;
        }
      }

      setCart(null);
    };

    initCart();
  }, [user?.id]);
    

    // Fetch existing cart for this device
  //   const fetchCart = async () => {
  //     try {
  //       const res = await fetch(
  //         `http://192.168.18.41:5001/carts?deviceId=${storedId}`
  //       );
  //       const data = await res.json();
  //       if (data.length > 0) {
  //         setCart(data[0]); // load existing cart
  //       }
  //     } catch (err) {
  //       console.error("❌ Error fetching cart:", err);
  //     }
  //   };

  //   fetchCart();
    


 // 🔹 Add to cart
  const addtocart = async (product) => {
    try {
      if (!cart) {
        const newItem = {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          photo: product.photo,
          quantity: 1,
        };

        if (!user?.id) {
          const newGuestCart = createGuestCart([newItem]);
          saveGuestCart(newGuestCart);
          setCart(newGuestCart);
          return { ok: true };
        }

        // create new cart
        const { data, error } = await supabase.from("carts").insert([
          {
            deviceId,
            userId: user.id,
            items: [
              {
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                photo: product.photo,
                quantity: 1,
              },
            ],
          },
        ]).select("id, deviceId, userId, items").single();

        if (error) {
          console.log("❌ Insert error:", error.message);
        } else {
          setCart(data);
          console.log("🆕 Cart created");
        }

        return { ok: !error };
      }

      // update existing cart
      const existing = cart.items.find((p) => p.productId === product.id);

      let updatedItems;

      if (existing) {
        updatedItems = cart.items.map((p) =>
          p.productId === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        updatedItems = [
          ...cart.items,
          {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            photo: product.photo,
            quantity: 1,
          },
        ];
      }

      await updateCart(updatedItems);
      return { ok: true };
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      return { ok: false, reason: "error" };
    }
  };

  // 🔹 Update cart helper
  const updateCart = async (items) => {
    if (!cart?.id) return;

    if (!user?.id || cart.id === "guest") {
      const updatedCart = { ...cart, items };
      saveGuestCart(updatedCart);
      setCart(updatedCart);
      return;
    }

    const previousCart = cart;
    setCart((prev) => (prev ? { ...prev, items } : prev));

    const { data, error } = await supabase
      .from("carts")
      .update({ items })
      .eq("id", cart.id)
      .select("id, deviceId, userId, items")
      .single();

    if (error) {
      console.log("❌ Update error:", error.message);
      setCart(previousCart);
    } else {
      setCart(data);
    }
  };

  // 🔹 Increase qty
  const increaseQty = async (productId) => {
    if (!cart) return;

    const updatedItems = cart.items.map((p) =>
      p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
    );

    setCart((prev) => (prev ? { ...prev, items: updatedItems } : prev));
    await updateCart(updatedItems);
  };

  // 🔹 Decrease qty
  const decreaseQty = async (productId) => {
    if (!cart) return;

    const updatedItems = cart.items
      .map((p) =>
        p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p
      )
      .filter((p) => p.quantity > 0);

    setCart((prev) => (prev ? { ...prev, items: updatedItems } : prev));
    await updateCart(updatedItems);
  };

  // 🔹 Remove item
  const removeFromCart = async (productId) => {
    if (!cart) return;

    const updatedItems = cart.items.filter(
      (p) => p.productId !== productId
    );

    setCart((prev) => (prev ? { ...prev, items: updatedItems } : prev));
    await updateCart(updatedItems);
  };

  // 🔹 Clear cart
   const clearCart = async () => {
    if (!cart) return;

    if (!user?.id || cart.id === "guest") {
      localStorage.removeItem(GUEST_CART_KEY);
      setCart(createGuestCart());
      return;
    }

    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("id", cart.id);

    if (error) {
      console.log("❌ Delete error:", error.message);
    } else {
      setCart(null);
      console.log("🗑️ Cart cleared");
    }
  };



//   // ---- Add item to cart ----
//   const addtocart = async (product) => {
//     try {
//       if (!cart) {
//         // Create new cart
//         const newCart = {
//           id: uuidv4(),
//           deviceId,
//           userId: null, // no auth yet
//           items: [
//             {
//               productId: product.id,
//               name: product.name,
//               price: Number(product.price),
//               photo: product.photo,
//               quantity: 1,
//             },
//           ],
//         };

//         const res = await fetch("http://192.168.18.41:5001/carts", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newCart),
//         });

//         const savedCart = await res.json();
//         setCart(savedCart);
//         console.log("🆕 Cart created:", savedCart);
//         return;
//       }

//       // Update existing cart
//       const existing = cart.items.find((p) => p.productId === product.id);

//       let updatedItems;
//       if (existing) {
//         updatedItems = cart.items.map((p) =>
//           p.productId === product.id
//             ? { ...p, quantity: p.quantity + 1 }
//             : p
//         );
//       } else {
//         updatedItems = [
//           ...cart.items,
//           {
//             productId: product.id,
//             name: product.name,
//             price: Number(product.price),
//             photo: product.photo,
//             quantity: 1,
//           },
//         ];
//       }

//       const updatedCart = { ...cart, items: updatedItems };
//       await syncCart(updatedCart);
//     } catch (err) {
//       console.error("❌ Error adding to cart:", err);
//     }
//   };

//   // ---- Increase qty ----
//   const increaseQty = async (productId) => {
//     if (!cart) return;
//     const updatedItems = cart.items.map((p) =>
//       p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
//     );
//     await syncCart({ ...cart, items: updatedItems });
//   };

//   // ---- Decrease qty ----
//   const decreaseQty = async (productId) => {
//     if (!cart) return;
//     const updatedItems = cart.items
//       .map((p) =>
//         p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p
//       )
//       .filter((p) => p.quantity > 0);
//     await syncCart({ ...cart, items: updatedItems });
//   };

//   // ---- Remove item ----
//   const removeFromCart = async (productId) => {
//     if (!cart) return;
//     const updatedItems = cart.items.filter((p) => p.productId !== productId);
//     await syncCart({ ...cart, items: updatedItems });
//   };

//   // ---- Sync cart with DB ----
//   const syncCart = async (updatedCart) => {
//     await fetch(`http://192.168.18.41:5001/carts/${cart.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedCart),
//     });
//     setCart(updatedCart);
//     console.log("✅ Cart synced:", updatedCart);
//   };

//   const clearCart = async () => {
//   if (!cart) return;
//   await fetch(`http://192.168.18.41:5001/carts${cart.id}`, {
//     method: "DELETE",
//   });
//   setCart(null);
//   console.log("🗑️ Cart deleted from DB");
// };


  return (
    <cartContext.Provider
      value={{
        cart,
        addtocart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => useContext(cartContext);
