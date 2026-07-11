import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { brand } from "../brand";

export const Footer = () => {
  return (
    <footer className="border-t border-gold/20 bg-ink px-6 pt-16 text-ivory">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <img className="h-24 w-24 rounded-full object-contain bg-[#222222] border border-[#f472b6]/30 shadow-md" src={brand.logo} alt={brand.name} />
          <h3 className="mt-4 text-xl font-serif font-semibold text-gold-soft">{brand.name}</h3>
          <p className="mt-3 text-sm leading-6 text-ivory/70">{brand.description}</p>
        </div>

        <div>
          <h3 className="text-xl font-serif font-semibold text-gold-soft">Contact</h3>
          <p className="mt-4 text-sm text-ivory/70">Phone: 03315353053</p>
          <p className="mt-2 text-sm text-ivory/70">Email: Haleelgroups@gmail.com</p>
        </div>

        <div>
          <h3 className="text-xl font-serif font-semibold text-gold-soft">Follow The Trail</h3>
          <div className="mt-5 flex gap-4 text-xl">
            <a href="https://www.facebook.com/HaleelScents/" target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 transition hover:bg-gold hover:text-ink hover-lift"><FaFacebookF /></a>
            <a href="https://www.instagram.com/haleel_scents?igsh=Znp2N3N1ZzM5dGY2" target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 transition hover:bg-gold hover:text-ink hover-lift"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@haleelscents?_r=1&_t=ZS-97vR5p6Sxwy" target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 transition hover:bg-gold hover:text-ink hover-lift"><FaTiktok /></a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-gold/15" />
      <div className="py-5 text-center text-sm text-ivory/60">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
};
