import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export const ShopByCategory = () => {
  const navigate = useNavigate();
  const categories = [
    { name: "For Him", image: "/men.jpg", path: "/products/men" },
    { name: "For Her", image: "/women.jpg", path: "/products/women" },
  ];

  return (
    <section className="bg-[#0b0a08] px-4 py-18">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-[#d7b46a]">Choose your aura</p>
        <h2 className="mt-3 text-center text-3xl font-semibold text-[#fff8e8] md:text-5xl">
          Shop By Category
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => navigate(cat.path)}
              className="group relative overflow-hidden rounded-lg border border-[#d7b46a]/18 text-left shadow-2xl"
            >
              <img src={cat.image} alt={cat.name} className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-110 md:h-[480px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a08] via-[#0b0a08]/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between border-t border-[#d7b46a]/25 pt-5">
                  <span className="text-2xl font-semibold text-[#fff8e8]">{cat.name}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d7b46a] text-[#0b0a08] transition group-hover:translate-x-1">
                    <FiArrowRight />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
