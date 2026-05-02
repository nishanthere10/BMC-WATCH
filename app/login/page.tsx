"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, Mail, KeyRound } from "lucide-react";

function LoginContent() {
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Show error if redirected back from failed OAuth
  useEffect(() => {
    if (searchParams.get("error") === "oauth_failed") {
      setError("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setStage("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in with Google.");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
      if (error) throw error;
      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center cr-auth-bg px-4 pt-24 pb-12">
      <div className="w-full max-w-md">

        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,85,164,0.1)] bg-white dark:bg-[#0D1424]">
            <ShieldCheck size={22} className="text-[#0055A4] dark:text-[#38BDF8]" />
          </div>
          <div>
            <p className="font-heading font-extrabold text-xl text-slate-900 dark:text-white" style={{ letterSpacing: "-0.04em" }}>
              BMC<span style={{ color: "var(--cr-blue-mid)" }}>Watch</span>
            </p>
            <p className="cr-section-title">Citizen Portal</p>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="font-heading font-extrabold text-slate-900 dark:text-white mb-2"
          style={{ fontSize: "clamp(1.8rem, 5vw, 2.4rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
        >
          {stage === "email" ? "Citizen Login" : "Verify OTP"}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
          {stage === "email"
            ? "Sign in to rate works and earn civic points."
            : `Enter the 6-digit code sent to ${email}`}
        </p>

        {/* Form Panel */}
        <div className="cr-auth-panel">
          <AnimatePresence mode="wait">

            {/* Email Stage */}
            {stage === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <div>
                  <label className="cr-label flex items-center gap-1.5 mb-2">
                    <Mail size={11} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@mumbai.gov.in"
                    className="cr-input font-mono"
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="cr-error-box flex items-center gap-2 text-xs">
                    <AlertCircle size={13} className="shrink-0" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!email.includes("@") || loading}
                  className="cr-btn-primary w-full h-12 text-base"
                >
                  {loading ? "Sending OTP…" : "Get OTP on Email"}
                  <ArrowRight size={17} />
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 border-t-2 border-slate-100 dark:border-slate-800" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">Or</span>
                  <div className="flex-1 border-t-2 border-slate-100 dark:border-slate-800" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-3 text-sm font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1424] text-slate-700 dark:text-slate-200 hover:border-[#0055A4] dark:hover:border-[#38BDF8] shadow-[2px_2px_0_0_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0_0_rgba(0,85,164,0.1)] hover:-translate-y-[1px] transition-all duration-150"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </motion.form>
            )}

            {/* OTP Stage */}
            {stage === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <button
                  type="button"
                  onClick={() => { setStage("email"); setError(null); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={12} /> Wrong email?
                </button>

                <div>
                  <label className="cr-label flex items-center gap-1.5 mb-2">
                    <KeyRound size={11} /> 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="cr-input text-center tracking-[0.8em] text-2xl font-mono h-14"
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">Sent to {email}</p>
                </div>

                {error && (
                  <div className="cr-error-box flex items-center gap-2 text-xs">
                    <AlertCircle size={13} className="shrink-0" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otp.length !== 6 || loading}
                  className="cr-btn-accent w-full h-12 flex items-center justify-center gap-2 text-base"
                  style={{ backgroundColor: "var(--cr-india-green)" }}
                >
                  {loading ? "Verifying…" : "Verify & Login"}
                </button>
              </motion.form>
            )}

          </AnimatePresence>
        </div>

        <p className="text-center text-[11px] font-mono text-slate-400 mt-6">
          By signing in you agree to our{" "}
          <a href="#" className="underline hover:text-slate-700 dark:hover:text-white transition-colors">Terms</a>{" "}
          &amp;{" "}
          <a href="#" className="underline hover:text-slate-700 dark:hover:text-white transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center cr-auth-bg">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
