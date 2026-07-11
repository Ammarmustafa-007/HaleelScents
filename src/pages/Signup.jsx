import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { notify } from "../components/notify";
import { brand } from "../brand";

export const Signup = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name || !email || !password) {
      notify.warning("Please fill all fields before creating your account.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      setIsSubmitting(false);
      notify.error(error.message);
    } else {
      notify.success("Account created successfully. Welcome to Haleel Scents.");
      navigate(redirectTo, { replace: true });
    }
  };

  const handleGoogleSignup = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { error } = await signInWithGoogle(redirectTo);
    if (error) {
      setIsSubmitting(false);
      notify.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] px-4 py-10 text-[#4c1d95]">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_80%_12%,rgba(215,180,106,0.16),transparent_34rem),linear-gradient(135deg,#fff0f5,#ffffff)]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl overflow-hidden rounded-xl border border-[#f472b6]/20 bg-white/60 backdrop-blur-md shadow-2xl md:grid-cols-[.95fr_1.05fr]">
        <div className="flex items-center justify-center bg-white p-8 text-[#4c1d95] sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center md:hidden">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#f472b6]/30 bg-[#181818] shadow-lg">
                <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover scale-[1.35] -translate-y-[6px]" />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db2777]">Join Haleel</p>
            <h2 className="mt-3 text-3xl font-bold">Create Account</h2>
            <p className="mt-2 text-[#4c1d95]/70">Begin your fragrance ritual.</p>
            <form onSubmit={handleSignup} className="mt-8 space-y-4">
              <input type="text" required className="w-full rounded-md border border-[#f472b6]/35 bg-[#fff0f5]/50 px-4 py-3 text-[#4c1d95] placeholder:text-[#4c1d95]/40 outline-none transition focus:border-[#db2777] focus:ring-4 focus:ring-[#f472b6]/20" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" required className="w-full rounded-md border border-[#f472b6]/35 bg-[#fff0f5]/50 px-4 py-3 text-[#4c1d95] placeholder:text-[#4c1d95]/40 outline-none transition focus:border-[#db2777] focus:ring-4 focus:ring-[#f472b6]/20" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" required className="w-full rounded-md border border-[#f472b6]/35 bg-[#fff0f5]/50 px-4 py-3 text-[#4c1d95] placeholder:text-[#4c1d95]/40 outline-none transition focus:border-[#db2777] focus:ring-4 focus:ring-[#f472b6]/20" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" disabled={isSubmitting} className="haleel-gold-button w-full rounded-md px-4 py-3 font-bold uppercase tracking-[0.16em] disabled:opacity-60">
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </form>
            <button onClick={handleGoogleSignup} disabled={isSubmitting} className="mt-5 w-full rounded-md border border-[#f472b6]/35 bg-[#fff0f5] px-4 py-3 font-semibold text-[#db2777] transition hover:bg-[#fce7f3] disabled:opacity-60">
              Continue with Google
            </button>
            <p className="mt-8 text-center text-sm text-[#4c1d95]/70">
              Already have an account?{" "}
              <Link to="/login" state={{ from: location.state?.from }} className="font-bold text-[#db2777]">Log in</Link>
            </p>
          </div>
        </div>
        <div className="relative hidden flex-col justify-end overflow-hidden p-12 md:flex">
          <img className="absolute inset-0 h-full w-full object-cover opacity-15" src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=1800&auto=format&fit=crop" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff0f5] via-[#fff0f5]/80 to-transparent" />
          <div className="relative">
            <div className="mb-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#f472b6]/30 bg-[#181818] shadow-lg">
              <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover scale-[1.35] -translate-y-[6px]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#db2777]">{brand.tagline}</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#4c1d95]">Step into {brand.name}</h1>
            <p className="mt-5 max-w-md text-[#4c1d95]/70">A private lane into premium fragrance, warm projection, and lasting identity.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
