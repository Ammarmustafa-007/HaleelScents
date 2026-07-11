import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  TextField,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    setUser(user);

    if (!user) return;

    fetchOrders(user.id);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, email, name, avatar_url")
      .eq("id", user.id)
      .single();

    setProfile(profileData);
    setName(profileData?.name || "");
  };

  const fetchOrders = async (userId) => {
    const { data } = await supabase
      .from("orders")
      .select("id, firstname, lastname, total, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setOrders(data || []);
  };

  const fetchOrderItems = async (orderId) => {
    const { data } = await supabase
      .from("order_items")
      .select("id, order_id, name, price, quantity")
      .eq("order_id", orderId);

    setOrderItems((prev) => ({ ...prev, [orderId]: data || [] }));
  };

  const toggleOrder = (orderId) => {
    if (openOrder === orderId) {
      setOpenOrder(null);
    } else {
      setOpenOrder(orderId);
      if (!orderItems[orderId]) {
        fetchOrderItems(orderId);
      }
    }
  };

  const uploadAvatar = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) return null;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSave = async () => {
    let avatar_url = profile?.avatar_url;

    if (avatar) {
      avatar_url = await uploadAvatar(avatar);
    }

    await supabase
      .from("profiles")
      .update({ name, avatar_url })
      .eq("id", user.id);

    setEditMode(false);
    fetchUser();
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f4f4", flexDirection: "column", gap: 3 }}>

      {/* PROFILE CARD */}
      <Paper elevation={8} sx={{ width: 420, p: 4, borderRadius: 4, textAlign: "center" }}>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold">My Profile</Typography>
          <IconButton onClick={() => setEditMode(!editMode)}>
            {editMode ? <CheckIcon /> : <EditIcon />}
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Avatar src={profile?.avatar_url || ""} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />

        {editMode && <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />}

        {editMode ? (
          <TextField fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2 }} />
        ) : (
          <Typography variant="h6" mt={2}>{profile?.name}</Typography>
        )}

        <Typography color="gray">{user?.email}</Typography>
        {editMode && (
          <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSave}>Save Changes</Button>
        )}

        <Button onClick={() => navigate("/")} variant="outlined" sx={{ mt: 2 }}>Back to Home</Button>
      </Paper>

      {/* ORDERS SECTION */}
      <Box sx={{ width: "90%", maxWidth: 700 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>My Orders</Typography>

        {orders.map((order) => (
          <Card key={order.id} sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography fontWeight="bold">Order #{order.id}</Typography>
                  <Typography variant="body2">{new Date(order.created_at).toLocaleString()}</Typography>
                  <Typography color="orange">Status: {order.status || "Processing"}</Typography>
                </div>

                <IconButton onClick={() => toggleOrder(order.id)}>
                  <ExpandMoreIcon />
                </IconButton>
              </Stack>

              <Collapse in={openOrder === order.id} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2 }} />

                {(orderItems[order.id] || []).map((item) => (
                  <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>{item.name} x {item.quantity}</Typography>
                    <Typography>Rs {Number(item.price) * item.quantity}</Typography>
                  </Box>
                ))}

              </Collapse>

            </CardContent>
          </Card>
        ))}
      </Box>

    </Box>
  );
};
