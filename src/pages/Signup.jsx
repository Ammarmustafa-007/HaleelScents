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
    <div className="min-h-screen bg-[#0b0a08] px-4 py-10 text-[#fff8e8]">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_80%_12%,rgba(215,180,106,0.16),transparent_34rem),linear-gradient(135deg,#0b0a08,#211d17)]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl overflow-hidden rounded-lg border border-[#d7b46a]/18 bg-[#11100d]/92 shadow-2xl md:grid-cols-[.95fr_1.05fr]">
        <div className="flex items-center justify-center bg-[#fff8e8] p-8 text-[#171410] sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center md:hidden">
              <img src={brand.logo} alt={brand.name} className="h-20 w-20 rounded-full object-cover" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a86b3c]">Join Haleel</p>
            <h2 className="mt-3 text-3xl font-bold">Create Account</h2>
            <p className="mt-2 text-gray-600">Begin your fragrance ritual.</p>
            <form onSubmit={handleSignup} className="mt-8 space-y-4">
              <input type="text" required className="w-full rounded-md border border-[#d7b46a]/35 bg-white px-4 py-3 outline-none transition focus:border-[#a86b3c] focus:ring-4 focus:ring-[#d7b46a]/20" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" required className="w-full rounded-md border border-[#d7b46a]/35 bg-white px-4 py-3 outline-none transition focus:border-[#a86b3c] focus:ring-4 focus:ring-[#d7b46a]/20" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" required className="w-full rounded-md border border-[#d7b46a]/35 bg-white px-4 py-3 outline-none transition focus:border-[#a86b3c] focus:ring-4 focus:ring-[#d7b46a]/20" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" disabled={isSubmitting} className="haleel-gold-button w-full rounded-md px-4 py-3 font-bold uppercase tracking-[0.16em] disabled:opacity-60">
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </form>
            <button onClick={handleGoogleSignup} disabled={isSubmitting} className="mt-5 w-full rounded-md border border-[#d7b46a]/35 bg-white px-4 py-3 font-semibold text-[#171410] transition hover:bg-[#fff3cd] disabled:opacity-60">
              Continue with Google
            </button>
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" state={{ from: location.state?.from }} className="font-bold text-[#a86b3c]">Log in</Link>
            </p>
          </div>
        </div>
        <div className="relative hidden flex-col justify-end overflow-hidden p-12 md:flex">
          <img className="absolute inset-0 h-full w-full object-cover opacity-25" src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=1800&auto=format&fit=crop" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a08] via-[#0b0a08]/72 to-transparent" />
          <div className="relative">
            <img src={brand.logo} alt={brand.name} className="mb-8 h-24 w-24 rounded-full border border-[#d7b46a]/30 object-cover shadow-2xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d7b46a]">{brand.tagline}</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight">Step into {brand.name}</h1>
            <p className="mt-5 max-w-md text-[#cfc2aa]">A private lane into premium fragrance, warm projection, and lasting identity.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
