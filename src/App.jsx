import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Productprovider } from "./context/Productprovider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { BrandLoader } from "./components/BrandLoader";
import { AnimatedRoute } from "./components/AnimatedRoute";

import { HeartsBackground } from "./components/HeartsBackground";

const Home = React.lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.Home })),
);
const About = React.lazy(() =>
  import("./pages/About").then((module) => ({ default: module.About })),
);
const Contact = React.lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.Contact })),
);
const Cart = React.lazy(() =>
  import("./pages/Cart").then((module) => ({ default: module.Cart })),
);
const Checkout = React.lazy(() =>
  import("./pages/Checkout").then((module) => ({ default: module.Checkout })),
);
const Invoice = React.lazy(() =>
  import("./pages/Invoice").then((module) => ({ default: module.Invoice })),
);
const Login = React.lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Signup = React.lazy(() =>
  import("./pages/Signup").then((module) => ({ default: module.Signup })),
);
const UpdatePassword = React.lazy(() =>
  import("./pages/UpdatePassword").then((module) => ({
    default: module.UpdatePassword,
  })),
);
const Profile = React.lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.Profile })),
);
const CatagoryProducts = React.lazy(() =>
  import("./context/CatagoryProducts").then((module) => ({
    default: module.CatagoryProducts,
  })),
);
const AdminLayout = React.lazy(() =>
  import("./Admin/Adminlayout").then((module) => ({
    default: module.AdminLayout,
  })),
);
const AdminLogin = React.lazy(() => import("./Admin/AdminLogin"));
const Admindash = React.lazy(() =>
  import("./Admin/Admindash").then((module) => ({ default: module.Admindash })),
);
const Adminorders = React.lazy(() =>
  import("./Admin/Adminorders").then((module) => ({
    default: module.Adminorders,
  })),
);
const Adminproduct = React.lazy(() =>
  import("./Admin/Adminproduct").then((module) => ({
    default: module.Adminproduct,
  })),
);
const AddProduct = React.lazy(() =>
  import("./Admin/AddProduct").then((module) => ({ default: module.AddProduct })),
);
const Editproductpage = React.lazy(() =>
  import("./Admin/EditProductPage").then((module) => ({
    default: module.Editproductpage,
  })),
);

const RouteLoader = () => (
  <div className="min-h-screen bg-[#fff0f5]">
    <BrandLoader fullscreen label="Haleel Scents is loading" />
  </div>
);

const App = () => {
  // const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // useEffect(() => {
  //   const checkConnection = async () => {
  //     const { error } = await supabase.from("products").select("*");R

  //     if (error) {
  //       console.log("❌ Error:", error.message);
  //     } else {
  //       console.log("✅ Supabase connected");
  //     }
  //   };

  //   checkConnection();
  // }, []);

  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const handleLogin = (username, password) => {
  //   if (username === "ammar" && password === "ammar123") {
  //     setIsAuthenticated(true);
  //     return true;
  //   }
  //   return false;
  // };

  return (
    <BrowserRouter>
      <HeartsBackground />
      {/* <Navbar locate={loc}/> */}
      <Suspense fallback={<RouteLoader />}>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />

        <Route path="/login" element={<AnimatedRoute><Login /></AnimatedRoute>} />
        <Route path="/signup" element={<AnimatedRoute><Signup /></AnimatedRoute>} />

        <Route
          path="/products/:category"
          element={
            <AnimatedRoute>
              <Productprovider>
                <CatagoryProducts />
              </Productprovider>
            </AnimatedRoute>
          }
        />
        <Route path="/about" element={
            <AnimatedRoute><About /></AnimatedRoute>
          } />
        <Route path="/contact" element={
            <AnimatedRoute><Contact /></AnimatedRoute>
          } />
        <Route path="/update-password" element={ <AnimatedRoute><UpdatePassword /></AnimatedRoute> } />
        <Route path="/profile" element={<AnimatedRoute><Profile /></AnimatedRoute>} />

        {/* 🔒 Protected */}
        <Route
          path="/cart"
          element={
              <AnimatedRoute><Cart /></AnimatedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <AnimatedRoute>
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </AnimatedRoute>
          }
        />

        <Route path="/invoice" element={<AnimatedRoute><Invoice /></AnimatedRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        {/* <Route
          path="/admin/*"
          element={
            isAuthenticated ? (
              <AdminLayout />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        > */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute type="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Admindash />} />
          <Route path="orders" element={<Adminorders />} />
          <Route
            path="products"
            element={
              <Productprovider>
                <Adminproduct />
              </Productprovider>
            }
          />
          <Route
  path="products/add"
  element={
    <Productprovider>
      <AddProduct />
    </Productprovider>
  }
/>
<Route
  path="top-sellers"
  element={
    <Productprovider>
      <Adminproduct />
    </Productprovider>
  }
/>

<Route
  path="new-arrivals"
  element={
    <Productprovider>
      <Adminproduct  />
    </Productprovider>
  }
/>

<Route
  path="products/edit/:id"
  element={
    <Productprovider>
      <Editproductpage />
    </Productprovider>
  }
/>
          {/* default -> redirect to dashboard */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3200}
        newestOnTop
        closeOnClick={false}
        pauseOnHover
        draggable={false}
        limit={4}
        toastClassName="scent-toast-shell"
        bodyClassName="scent-toast-body"
      />
    </BrowserRouter>
  );
};

export default App;
