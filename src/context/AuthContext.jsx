import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // SIGNUP
   const signUp = async (email, password, name) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
  };
  

  // LOGIN
  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  // GOOGLE LOGIN
  const signInWithGoogle = async (redirectPath = "/") => {
    localStorage.setItem("haleelscents_auth_redirect", redirectPath);

    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });
  };
   // LOGOUT
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Get current user
//   const getUser = async () => {
//     const { data } = await supabase.auth.getUser();
//     setUser(data?.user || null);
//     setLoading(false);
//   };

//   useEffect(() => {
//     getUser();

//     // 🔹 Listen auth changes
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   // 🔹 SIGN UP
//   const signUp = async (email, password) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });
//   if (data.user) {
//     await supabase.from("profiles").insert([
//       {
//         id: data.user.id,
//         email: data.user.email,
//         role: "user",
//       },
//     ]);
//   }

//     return { data, error };
//   };

//   // 🔹 LOGIN
//   const signIn = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     return { data, error };
//   };

//   // 🔹 GOOGLE LOGIN
//   const signInWithGoogle = async () => {
//     return await supabase.auth.signInWithOAuth({
//       provider: "google",
//     });
//   };

//   // 🔹 LOGOUT
//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signUp,
//         signIn,
//         signInWithGoogle,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
