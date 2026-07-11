import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { brand } from "../brand";

export const Carousel = () => {
  const scrollToTopSellers = () => {
    document
      .getElementById("top-sellers")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4400,
  };

  const slides = [
    {
      eyebrow: "For Him",
      title: "Gold Special Edition",
      copy: "The ultimate expression of masculine luxury. Deep warmth, polished projection, and an elegant trail crafted for everyday greatness.",
      image: "/gold-special-edition.jpg",
    },
    {
      eyebrow: "For Her",
      title: "Sensual Flora",
      copy: "A captivating floral bouquet designed to leave a memorable and elegant impression.",
      image: "/sensual-flora.jpg",
    },
  ];

  return (
    <section className="overflow-hidden bg-ink">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.title}>
            <div className="relative min-h-[520px] overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,180,106,0.2),transparent_32rem),linear-gradient(135deg,var(--haleel-ink)_0%,var(--haleel-charcoal)_48%,var(--haleel-panel)_100%)]" />
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px)] [background-size:42px_42px]" />

              <div className="relative mx-auto grid min-h-[520px] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 md:grid-cols-[1.05fr_.95fr] lg:px-10">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="max-w-2xl"
                >
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-gold">
                    {slide.eyebrow}
                  </p>
                  <h1 className="text-5xl font-serif font-semibold leading-tight text-ivory sm:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-7 text-ivory/80 sm:text-lg">
                    {slide.copy}
                  </p>
                  <button
                    type="button"
                    onClick={scrollToTopSellers}
                    className="haleel-gold-button mt-8 rounded-full px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] transition hover:scale-[1.03]"
                  >
                    Shop Collection
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.12 }}
                  className="relative mx-auto w-full max-w-md"
                >
                  <div className="absolute -inset-8 rounded-full bg-gold/15 blur-3xl" />
                  <div className="haleel-surface relative overflow-hidden rounded-lg p-4">
                    <motion.img
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.08 }}
                      transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                      className="aspect-[4/5] w-full rounded-md object-cover"
                      src={slide.image}
                      alt={slide.title}
                    />
                    <div className="absolute bottom-7 left-7 right-7 rounded-md border border-gold/20 bg-ink/72 p-4 glass-panel">
                      <img className="h-12 w-12 rounded-full object-cover" src={brand.logo} alt={brand.name} />
                      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gold-soft">{brand.tagline}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};
