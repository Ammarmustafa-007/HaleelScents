import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductproviderContext } from "./Productprovider";
import { ProductCard } from "../imports/ProductCard";
import { Navbar } from "../components/Navbar";
import { BrandLoader } from "../components/BrandLoader";

export const CatagoryProducts = () => {
  const { category } = useParams();
  const { products, loading, errorMessage } = useContext(ProductproviderContext);

  if (loading) return <div className="min-h-screen bg-[#fff0f5]"><BrandLoader label="Finding your fragrance" /></div>;

  if (errorMessage) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fff0f5] px-6 text-center text-[#4c1d95]">
        <h2 className="text-2xl font-semibold text-red-300">Unable to load products.</h2>
        <p className="mt-2 max-w-md text-[#b8aa90]">{errorMessage}</p>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (prod) => prod.category?.trim().toLowerCase() === category?.trim().toLowerCase(),
  );

  if (!products?.length || filteredProducts.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fff0f5] px-6 text-center text-[#4c1d95]">
          <h2 className="text-2xl font-semibold">No {category} products are available right now.</h2>
          <p className="mt-2 max-w-md text-[#b8aa90]">Please explore another category or check back soon.</p>
          <Link to="/" className="haleel-gold-button mt-6 rounded-md px-5 py-2 font-semibold">Back to Home</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#fff0f5] px-4 py-10 text-[#4c1d95]">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f472b6]">Haleel Collection</p>
        <h1 className="mt-3 text-4xl font-semibold capitalize">{category} Products</h1>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {filteredProducts.map((product) => {
            const { id, photo, name, price, details, category } = product;
            const { gender, occasion, notes, accords } = details || {};
            return (
              <ProductCard key={id} id={id} photo={photo} name={name} price={price} gender={gender} occasion={occasion} notes={notes} accords={accords} category={category} />
            );
          })}
        </div>
      </section>
    </>
  );
};
