import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Adminnav } from "./Adminnav";
import { Menu, X } from "lucide-react";
import { brand } from "../brand";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-[#fff0f5]">
      <header className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between border-b border-[#f472b6]/20 bg-[#fff0f5]/95 px-6 text-[#4c1d95] shadow-2xl backdrop-blur">
        <button className="rounded-md border border-[#f472b6]/20 p-2 text-[#f4df9e] md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        <h1 className="text-2xl font-semibold tracking-[0.18em] text-[#f4df9e]">ADMIN PANEL</h1>
        <Link to="/" className="flex items-center gap-3">
          <img className="h-14 w-14 rounded-full object-cover" src={brand.logo} alt={brand.name} />
          <span className="hidden text-sm uppercase tracking-[0.24em] text-[#f472b6] sm:block">Haleel</span>
        </Link>
      </header>

      <div className="flex flex-1 pt-20">
        <aside className={`fixed bottom-0 left-0 top-20 z-40 w-64 overflow-y-auto border-r border-[#f472b6]/20 bg-[#14110d] text-[#4c1d95] shadow-2xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <Adminnav setSidenav={setSidebarOpen} />
        </aside>
        <main className="flex-1 overflow-y-auto bg-[#4c1d95] p-6 text-[#ffffff] md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
