import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ProductCard } from "../imports/ProductCard";

export const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNewArrivals = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, category, photo, details")
      .eq("product_tag", "new_arrival")
      .limit(8);

    if (!error) setProducts(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  return (
    <section className="bg-charcoal px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-gold">Fresh arrivals</p>
        <h2 className="mt-3 text-center text-3xl font-serif font-semibold text-ivory md:text-5xl">
          New To The Ritual
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mx-auto my-3 flex h-[520px] w-[95%] max-w-xs flex-col overflow-hidden rounded-lg border border-gold/10 bg-ink p-3 shadow-lg">
                <div className="h-[230px] w-full shrink-0 skeleton-box" />
                <div className="mt-4 h-6 w-3/4 skeleton-box" />
                <div className="mt-2 h-8 w-1/2 skeleton-box" />
                <div className="mt-auto h-11 w-full skeleton-box" />
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                photo={p.photo}
                name={p.name}
                price={p.price}
                category={p.category}
                gender={p.details?.gender}
                occasion={p.details?.occasion}
                notes={p.details?.notes}
                accords={p.details?.accords}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-ivory/60">
              No new arrivals are available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
