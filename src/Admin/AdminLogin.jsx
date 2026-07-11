import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/notify";
import { brand } from "../brand";

const ADMIN_EMAIL = "admin@scentforest.com";
const ADMIN_PASSWORD = "ammar123";
const ADMIN_SESSION_KEY = "haleelscents_admin";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      notify.success("Admin login successful.");
      navigate("/admin/dashboard");
    } else {
      setErrorMessage("Invalid admin email or password.");
      notify.error("Invalid admin email or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0a08] px-6 py-12 text-[#fff8e8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(215,180,106,0.18),transparent_34rem),linear-gradient(135deg,#0b0a08,#211d17)]" />
      <form onSubmit={handleSubmit} className="haleel-surface relative w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col items-center text-center">
          <img className="h-28 w-28 rounded-full border border-[#d7b46a]/30 object-cover shadow-2xl" src={brand.logo} alt={brand.name} />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#d7b46a]">Admin Access</p>
          <h1 className="mt-3 text-3xl font-semibold">Haleel Control Room</h1>
        </div>

        {errorMessage && <p className="mt-5 rounded-md bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">{errorMessage}</p>}

        <div className="mt-8 space-y-5">
          <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Admin email" className="w-full rounded-md border border-[#d7b46a]/25 bg-[#0b0a08]/70 px-4 py-3 text-[#fff8e8] outline-none transition placeholder:text-[#8d8069] focus:border-[#d7b46a] focus:ring-4 focus:ring-[#d7b46a]/10" />
          <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full rounded-md border border-[#d7b46a]/25 bg-[#0b0a08]/70 px-4 py-3 text-[#fff8e8] outline-none transition placeholder:text-[#8d8069] focus:border-[#d7b46a] focus:ring-4 focus:ring-[#d7b46a]/10" />
          <button type="submit" disabled={isSubmitting} className="haleel-gold-button w-full rounded-md px-4 py-3 font-bold uppercase tracking-[0.16em] disabled:opacity-60">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
