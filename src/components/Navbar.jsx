import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { IoCartOutline } from "react-icons/io5";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import axios from "axios";
import { useCart } from "../context/Cartcontext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { brand } from "../brand";

const navItems = [
  { name: "Home", path: "/" },
  {
    name: "Fragrances",
    dropdown: true,
    items: [
      { category: "Men", path: "/products/men" },
      { category: "Women", path: "/products/women" },
      { category: "Elevate", path: "/products/elevate" },
      { category: "100 ML", path: "/products/100ml" },
    ],
  },
  { name: "Our Story", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [loc, setloc] = useState();
  const { cart } = useCart();
  const itemCount = (cart?.items || []).reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(null);
  const menuRef = useRef(null);
  const isProductsActive = location.pathname.startsWith("/products");

  useEffect(() => {
    if (user) {
      getProfile();
      getSuperadminStatus();
    } else {
      setProfile(null);
      setIsSuperadmin(false);
    }
  }, [user]);

  const getProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .eq("id", user.id)
      .single();

    setProfile(data);
  };

  const getSuperadminStatus = async () => {
    const { data } = await supabase.rpc("is_superadmin");
    setIsSuperadmin(Boolean(data));
  };

  const getlocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`;

      try {
        const location = await axios.get(url);
        setloc(location.data.results[0]);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    });
  };

  const handleProfileMenu = () => {
    setShowLocation((prev) => !prev);
    if (!loc) getlocation();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocation(false);
      }
    };
    if (showLocation) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLocation]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const linkClass = ({ isActive }) =>
    `relative transition duration-300 hover:text-gold-soft ${isActive ? "text-gold-soft" : "text-ivory"}`;

  return (
    <header className="sticky top-0 z-[9999] border-b border-[#f472b6]/20 bg-[#fff0f5] text-[#4c1d95] shadow-lg w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-7 sm:px-6 relative">
        <div className="flex flex-1 items-center justify-start">
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-4 xl:gap-7 text-sm font-semibold uppercase tracking-[0.18em]">
            {navItems.map((item) =>
              !item.dropdown ? (
                <li key={item.name}>
                  <NavLink to={item.path} className={linkClass}>
                    {item.name}
                  </NavLink>
                </li>
              ) : (
                <li key={item.name} className="relative">
                  <button
                    onClick={() => setDesktopOpen((prev) => !prev)}
                    aria-expanded={desktopOpen}
                    className={`flex items-center gap-1 transition hover:text-gold-soft ${isProductsActive ? "text-gold-soft" : "text-ivory"}`}
                  >
                    {item.name}
                    {desktopOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>

                  <ul
                    className={`absolute left-0 mt-4 w-52 overflow-hidden rounded-lg glass-panel transition-all duration-300 ${desktopOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
                  >
                    {item.items.map((sub) => (
                      <li key={sub.category}>
                        <NavLink
                          to={sub.path}
                          onClick={() => setDesktopOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-3 text-sm transition hover:bg-gold/10 ${isActive ? "text-gold-soft" : "text-ivory/80"}`
                          }
                        >
                          {sub.category}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ),
            )}
            </ul>
          </nav>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-gold-soft lg:hidden"
            aria-label="Open navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {createPortal(
          <div className={`fixed inset-0 z-[100000] lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div 
              className={`absolute inset-0 bg-[#fff0f5]/80 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`} 
              onClick={() => setMenuOpen(false)}
            />
            <div
              className={`absolute left-0 top-0 flex h-full w-72 flex-col border-r border-[#f472b6]/20 bg-[#fff0f5] shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              <div className="flex items-center justify-between border-b border-[#f472b6]/20 p-6">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#f472b6]">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="text-[#4c1d95] transition hover:text-[#f472b6]">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <ul className="flex flex-col gap-6 text-lg">
                  {navItems.map((item) =>
                    !item.dropdown ? (
                      <li key={item.name}>
                        <NavLink
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className={({ isActive }) =>
                            `block rounded-md px-3 py-2 transition ${isActive ? "bg-[#f472b6]/10 text-[#f472b6]" : "text-[#4c1d95]"}`
                          }
                        >
                          {item.name}
                        </NavLink>
                      </li>
                    ) : (
                      <li key={item.name}>
                        <button
                          onClick={() => setMobileOpen((prev) => !prev)}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-[#4c1d95]"
                        >
                          {item.name}
                          {mobileOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </button>
                        {mobileOpen && (
                          <ul className="mt-2 flex flex-col gap-1 pl-3">
                            {item.items.map((sub) => (
                              <li key={sub.category}>
                                <NavLink
                                  to={sub.path}
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMenuOpen(false);
                                  }}
                                  className={({ isActive }) =>
                                    `block rounded-md px-4 py-2 text-sm ${isActive ? "text-[#f472b6]" : "text-[#4c1d95]/70"}`
                                  }
                                >
                                  {sub.category}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>,
          document.body
        )}

        <div className="flex justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Link to="/" className="group flex items-center gap-3 pointer-events-auto">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-[#222222] border border-[#f472b6]/30 shadow-[0_0_30px_rgba(244,114,182,0.15)] transition duration-300 group-hover:border-[#f472b6] flex items-center justify-center shrink-0">
              <img className="w-full h-full object-contain scale-[1.3]" src={brand.logo} alt={brand.name} />
            </div>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-lg font-semibold text-gold-soft">HALEEL</span>
              <span className="mt-1 text-[10px] uppercase text-gold/70">Scents</span>
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-5 relative z-50">
          <div ref={locationRef} className="relative">
            <button
              onClick={handleProfileMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-gold-soft transition hover:bg-gold/10 hover-lift"
              aria-label="Open profile menu"
            >
              <PermIdentityIcon className="h-7 w-7" />
            </button>

            <div
              className={`absolute right-0 top-full mt-4 w-64 rounded-lg glass-panel text-ivory transition-all duration-300 ${showLocation ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
            >
              <div className="space-y-4 p-4">
                <div className="border-b border-gold/15 pb-3">
                  <p className="truncate text-sm font-semibold text-gold-soft">
                    {loc?.city || loc?.county || "Location unavailable"}
                  </p>
                  <p className="mt-1 truncate text-xs text-ivory/70">
                    {loc?.neighbourhood || "Open menu to detect area"}
                  </p>
                </div>

                {user ? (
                  <div className="flex flex-col gap-2">
                    <span className="truncate text-sm font-medium">
                      {profile?.name || user.email}
                    </span>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowLocation(false);
                      }}
                      className="rounded-md border border-[#f472b6]/30 px-3 py-2 text-sm text-[#db2777] font-medium transition hover:bg-[#fce7f3]"
                    >
                      View Profile
                    </button>
                    {isSuperadmin && (
                      <button
                        onClick={() => {
                          navigate("/admin/dashboard");
                          setShowLocation(false);
                        }}
                        className="haleel-gold-button rounded-md px-3 py-2 text-sm font-semibold"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={signOut}
                      className="rounded-md bg-[#db2777] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#be185d]"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="haleel-gold-button block rounded-md px-3 py-2 text-center text-sm font-semibold">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-gold-soft transition hover:bg-gold/10 hover-lift"
            aria-label="Open cart"
          >
            <IoCartOutline className="h-7 w-7" />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f472b6] px-1 text-xs font-bold text-white shadow-sm">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
