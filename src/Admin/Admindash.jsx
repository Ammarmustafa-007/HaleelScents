import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InventoryIcon from "@mui/icons-material/Inventory";
import { supabase } from "../supabaseClient";

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  })}`;

export const Admindash = () => {
  const [dashboard, setDashboard] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    catalogueItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setErrorMessage("");

      const [
        { count: productCount, error: productError },
        { data: orders, error: orderError },
      ] = await Promise.all([
        supabase
          .from("products")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("id, total, status"),
      ]);

      if (productError || orderError) {
        setErrorMessage(
          productError?.message ||
          orderError?.message ||
          "Failed to fetch dashboard data"
        );
        setLoading(false);
        return;
      }

      const orderRows = orders || [];
      const totalSales = orderRows.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
      );
      const pendingOrders = orderRows.filter(
        (order) => String(order.status || "").toLowerCase() === "pending"
      ).length;

      setDashboard({
        totalSales,
        totalOrders: orderRows.length,
        pendingOrders,
        catalogueItems: productCount || 0,
      });
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  const stats = [
    { title: "Total Sales", value: formatCurrency(dashboard.totalSales), icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#f472b6" }} /> },
    { title: "Total Orders", value: dashboard.totalOrders, icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "blue" }} /> },
    { title: "Pending Orders", value: dashboard.pendingOrders, icon: <PendingActionsIcon sx={{ fontSize: 40, color: "orange" }} /> },
    { title: "Catalogue Items", value: dashboard.catalogueItems, icon: <InventoryIcon sx={{ fontSize: 40, color: "purple" }} /> },
  ];

  return (
    <>
     
      <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        <Typography className="italic font-bold fade-in-up " variant="h4"  gutterBottom>
          Admin Dashboard
        </Typography>

        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <br />

        {/* Flex container for cards */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}
        className="fade-in-up">
          {stats.map((stat, index) => (
            <Card
              key={index}
              sx={{
                flex: "1 1 240px", // responsive sizing
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                {/* Icon */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  {stat.icon}
                </Box>

                {/* Title */}
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>

                {/* Value */}
                <Typography variant="h4" color="primary">
                  {loading ? "..." : stat.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};
