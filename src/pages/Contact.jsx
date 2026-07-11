import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { supabase } from "../supabaseClient";
import { Container, Grid, Typography } from "@mui/material";
import { notify } from "../components/notify";

export const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { error } = await supabase.from("contacts").insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      },
    ]);

    if (!error) {
      notify.success("Message sent successfully. We will get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      console.log(error.message);
      notify.error(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="relative h-[55vh] flex items-center justify-center bg-[linear-gradient(135deg,#0b0a08,#211d17)] text-white">
        <div className="absolute w-[300px] h-[300px] bg-[#d7b46a]/15 blur-[120px] rounded-full top-10 left-10"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#fff3cd]0/20 blur-[120px] rounded-full bottom-10 right-10"></div>

        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">
            Contact Haleel
          </h1>
          <p className="text-gray-300">
            We would love to help you choose your next signature scent.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-[#0b0a08] py-16 text-[#fff8e8]">
        <Container maxWidth="md">
          <div className="bg-[#171410] border border-[#d7b46a]/20 p-10 rounded-3xl shadow-2xl">

            <Typography variant="h4" fontWeight="bold" mb={5} textAlign="center" color="#d7b46a">
              Get In Touch
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-5">

  {/* ROW 1: NAME + EMAIL */}
  <div className="flex flex-col md:flex-row gap-5">
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={form.name}
      onChange={handleChange}
      className="w-full bg-[#0b0a08] border border-[#d7b46a]/30 px-4 py-3 outline-none focus:border-[#d7b46a] text-[#fff8e8] placeholder:text-[#fff8e8]/40 rounded-md transition"
    />

    <input
      type="email"
      name="email"
      placeholder="Email *"
      value={form.email}
      onChange={handleChange}
      required
      className="w-full bg-[#0b0a08] border border-[#d7b46a]/30 px-4 py-3 outline-none focus:border-[#d7b46a] text-[#fff8e8] placeholder:text-[#fff8e8]/40 rounded-md transition"
    />
  </div>

  {/* ROW 2: PHONE */}
  <div>
    <input
      type="text"
      name="phone"
      placeholder="Phone number"
      value={form.phone}
      onChange={handleChange}
      className="w-full bg-[#0b0a08] border border-[#d7b46a]/30 px-4 py-3 outline-none focus:border-[#d7b46a] text-[#fff8e8] placeholder:text-[#fff8e8]/40 rounded-md transition"
    />
  </div>

  {/* ROW 3: MESSAGE */}
  <div>
    <textarea
      name="message"
      rows="5"
      placeholder="Comment"
      value={form.message}
      onChange={handleChange}
      className="w-full bg-[#0b0a08] border border-[#d7b46a]/30 px-4 py-3 outline-none resize-none focus:border-[#d7b46a] text-[#fff8e8] placeholder:text-[#fff8e8]/40 rounded-md transition"
    />
  </div>

  {/* ROW 4: BUTTON */}
  <div className="flex justify-end mt-6">
    <button
      type="submit"
      disabled={loading}
      className="haleel-gold-button w-full sm:w-auto px-10 py-3 transition rounded-md font-bold tracking-widest uppercase text-sm disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? "Sending..." : "Send Message"}
    </button>
  </div>

</form>

          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
};
