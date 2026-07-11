import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductproviderContext } from "./Productprovider";
import { ProductCard } from "../imports/ProductCard";
import { BrandLoader } from "../components/BrandLoader";

export const Productapi = () => {
  const { products, loading, errorMessage } = useContext(ProductproviderContext);

  if (loading) return <BrandLoader label="Curating Haleel scents" />;

  if (errorMessage) {
    return <p className="py-16 text-center text-red-400">Unable to load products right now.</p>;
  }

  if (!products.length) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center text-ivory">
        <h2 className="text-2xl font-serif font-semibold">No products are available right now.</h2>
        <p className="mt-2 max-w-md text-ivory/70">Please check back soon. We are updating the catalogue.</p>
        <Link to="/" className="haleel-gold-button mt-6 rounded-md px-5 py-2 font-semibold hover-lift">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-ink py-10 px-4 md:px-8">
      {products.map((product) => {
        const { id, photo, name, price, details, category } = product;
        const { gender, occasion, notes, accords } = details || {};
        return (
          <ProductCard key={id} id={id} photo={photo} name={name} price={price} gender={gender} occasion={occasion} notes={notes} accords={accords} category={category} />
        );
      })}
    </div>
  );
};
