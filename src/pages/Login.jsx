import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { notify } from "../components/notify";
import { brand } from "../brand";

export const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ensureProfile = async (user) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (error) return;

    if (!data) {
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || "",
        role: "user",
      });
    }
  };

  const handleRedirect = async () => {
    const pendingRedirect =
      localStorage.getItem("haleelscents_auth_redirect") || redirectTo;

    localStorage.removeItem("haleelscents_auth_redirect");
    navigate(pendingRedirect, { replace: true });
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { error } = await signInWithGoogle(redirectTo);
    if (error) {
      setIsSubmitting(false);
      notify.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { data, error } = await signIn(email, password);
    if (error) {
      setIsSubmitting(false);
      notify.error(error.message);
      return;
    }
    await ensureProfile(data.user);
    await handleRedirect();
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        await ensureProfile(data.user);
        await handleRedirect();
      }
    };
    checkUser();
  }, []);

  const handleForgotPassword = async () => {
    if (isSubmitting) return;
    if (!email) {
      notify.warning("Please enter your email first to reset your password.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setIsSubmitting(false);
    if (error) notify.error(error.message);
    else notify.success("Password reset email sent. Please check your inbox.");
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] px-4 py-10 text-[#4c1d95]">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_18%,rgba(215,180,106,0.16),transparent_34rem),linear-gradient(135deg,#fff0f5,#ffffff)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl overflow-hidden rounded-xl border border-[#f472b6]/20 bg-white/60 backdrop-blur-md shadow-2xl md:grid-cols-[1.05fr_.95fr]"
      >
        <div className="relative hidden min-h-full flex-col justify-end overflow-hidden p-12 md:flex">
          <img className="absolute inset-0 h-full w-full object-cover opacity-15" src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1800&auto=format&fit=crop" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff0f5] via-[#fff0f5]/80 to-transparent" />
          <div className="relative">
            <div className="mb-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#f472b6]/30 bg-[#181818] shadow-lg">
              <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover scale-[1.35] -translate-y-[6px]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#db2777]">{brand.tagline}</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#4c1d95]">Welcome back to {brand.name}</h1>
            <p className="mt-5 max-w-md text-[#4c1d95]/70">Continue your fragrance ritual with curated premium scents and saved preferences.</p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white p-8 text-[#4c1d95] sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center md:hidden">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#f472b6]/30 bg-[#181818] shadow-lg">
                <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover scale-[1.35] -translate-y-[6px]" />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#db2777]">Private access</p>
            <h2 className="mt-3 text-3xl font-bold">Sign in</h2>
            <p className="mt-2 text-[#4c1d95]/70">Enter your details to continue.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <input type="email" required className="w-full rounded-md border border-[#f472b6]/35 bg-[#fff0f5]/50 px-4 py-3 text-[#4c1d95] placeholder:text-[#4c1d95]/40 outline-none transition focus:border-[#db2777] focus:ring-4 focus:ring-[#f472b6]/20" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" required className="w-full rounded-md border border-[#f472b6]/35 bg-[#fff0f5]/50 px-4 py-3 text-[#4c1d95] placeholder:text-[#4c1d95]/40 outline-none transition focus:border-[#db2777] focus:ring-4 focus:ring-[#f472b6]/20" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex justify-end">
                <button type="button" disabled={isSubmitting} onClick={handleForgotPassword} className="text-sm font-semibold text-[#db2777] transition hover:text-[#be185d] disabled:opacity-60">Forgot Password?</button>
              </div>
              <button type="submit" disabled={isSubmitting} className="haleel-gold-button w-full rounded-md px-4 py-3 font-bold uppercase tracking-[0.16em] disabled:opacity-60">
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <button onClick={handleGoogleLogin} disabled={isSubmitting} className="mt-5 w-full rounded-md border border-[#f472b6]/35 bg-[#fff0f5] px-4 py-3 font-semibold text-[#db2777] transition hover:bg-[#fce7f3] disabled:opacity-60">
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-[#4c1d95]/70">
              Don't have an account?{" "}
              <Link to="/signup" state={{ from: location.state?.from }} className="font-bold text-[#db2777]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
