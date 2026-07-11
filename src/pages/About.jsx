import React from "react";
import { Navbar } from "../components/Navbar";
import { Container, Typography, Grid, Box, Button } from "@mui/material";
import { Footer } from "../components/Footer";
import { brand } from "../brand";

export const About = () => {
  return (
    <>
      <Navbar />
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#fff0f5] px-6 text-[#4c1d95]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(215,180,106,0.18),transparent_34rem),linear-gradient(135deg,#fff0f5,#ffffff)]" />
        <div className="haleel-surface relative max-w-3xl rounded-lg p-8 text-center">
          <img className="mx-auto mb-6 h-24 w-24 rounded-full object-cover" src={brand.logo} alt={brand.name} />
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f472b6]">{brand.tagline}</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">Luxury in Every Drop</h1>
          <p className="mx-auto mt-5 max-w-xl text-[#cfc2aa]">
            Haleel Scents is built for bold presence, refined warmth, and fragrance memories that linger.
          </p>
        </div>
      </section>

      <div className="bg-[#fff0f5] py-16 text-[#4c1d95]">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" mb={2} color="#f472b6">
                Who We Are
              </Typography>
              <Typography color="#cfc2aa" mb={3}>
                We craft premium fragrances for people who treat scent as part of their identity.
                Every blend is selected for confidence, elegance, and memorable projection.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #f7e7ad, #f472b6, #db2777)",
                  color: "#ffffff",
                  borderRadius: "999px",
                  px: 4,
                  fontWeight: 700,
                  "&:hover": {
                    background: "linear-gradient(135deg, #f472b6, #db2777, #f7e7ad)",
                  }
                }}
              >
                Explore Collection
              </Button>
            </Grid>
          </Grid>

          <Box mt={12}>
            <img
              src="https://images.unsplash.com/photo-1615634260167-c8cdede054de"
              alt="Haleel Scents mission"
              className="h-[450px] w-full rounded-lg object-cover shadow-[0_0_40px_rgba(215,180,106,0.15)] border border-[#f472b6]/20"
            />
          </Box>

          <Box mt={12} textAlign="center">
            <Typography variant="h4" fontWeight="bold" mb={2} color="#f472b6">
              Our Mission
            </Typography>
            <Typography color="#cfc2aa" maxWidth="640px" mx="auto">
              To bring expressive, long-lasting fragrance experiences into everyday rituals without losing the feeling of luxury.
            </Typography>
          </Box>

          <Box mt={12}>
            <Grid container spacing={4} justifyContent="center">
              {[
                { title: "Premium Quality", desc: "Long-lasting fragrance character." },
                { title: "Bold Identity", desc: "Scents designed to be remembered." },
                { title: "Fast Delivery", desc: "Reliable service from cart to doorstep." },
              ].map((item) => (
                <Grid item xs={12} sm={4} key={item.title}>
                  <div className="h-full rounded-lg border border-[#f472b6]/20 bg-[#ffffff] p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:border-[#f472b6]/50">
                    <h3 className="mb-3 text-lg font-semibold text-[#4c1d95] tracking-wider uppercase text-sm">{item.title}</h3>
                    <p className="text-sm text-[#cfc2aa] leading-relaxed">{item.desc}</p>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </div>
      <Footer />
    </>
  );
};
