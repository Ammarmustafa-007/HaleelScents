import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ADMIN_SESSION_KEY = "haleelscents_admin";

export const Adminnav = ({ setSidenav }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Products", path: "/admin/products" },
    { label: "Top Sellers", path: "/admin/top-sellers" },
    { label: "New Arrivals", path: "/admin/new-arrivals" },
    { label: "Website", path: "/" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setSidenav(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <nav className="flex h-full flex-col p-4 pt-10">
      <p className="mb-6 px-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#f472b6]">
        Haleel Control
      </p>
      <div className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin/dashboard" || item.path === "/"}
            className={({ isActive }) =>
              `rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition ${isActive ? "bg-[#f472b6] text-[#fff0f5]" : "text-[#4c1d95] hover:bg-[#f472b6]/10 hover:text-[#f4df9e]"}`
            }
            onClick={() => setSidenav(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md border border-[#f472b6]/20 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#f4df9e] transition hover:bg-[#f472b6]/10"
      >
        Logout
      </button>
    </nav>
  );
};
