import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/notify";

export const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setIsUpdating(false);
      notify.error(error.message);
    } else {
      notify.success("Password updated successfully.");
      navigate("/login");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Update Password</h2>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleUpdatePassword} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
};
