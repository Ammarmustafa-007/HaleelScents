import React from "react";
import { Carousel } from "../components/Carousel";
import { Navbar } from "../components/Navbar";
import { TopSeller } from "../components/TopSeller";
import { NewArrival } from "../components/NewArrival";
import { ShopByCategory } from "../components/ShopByCategory";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <main className="min-h-screen bg-[#0b0a08] text-[#fff8e8]">
      <Navbar />
      <Carousel />
      <TopSeller />
      <NewArrival />
      <ShopByCategory />
      <Footer />
    </main>
  );
};
