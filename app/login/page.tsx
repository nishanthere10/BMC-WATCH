"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      
      if (error) throw error;
      setStage("otp");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      });
      
      if (error) throw error;
      
      // Success! Redirect to nearby or profile
      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center cr-auth-bg px-4 py-20">
      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl mb-4 border border-blue-100 dark:border-slate-700">
            <ShieldCheck size={32} className="text-[#2563EB] dark:text-[#38BDF8]" />
          </div>
          <h1 className="text-3xl font-extrabold font-heading tracking-tight">Citizen Login</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Log in to rate works and earn points</p>
        </div>

        <div className="cr-auth-panel">
          <AnimatePresence mode="wait">
            
            {stage === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOtp}
              >
                <div className="space-y-4">
                  <div>
                    <label className="cr-label block uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
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
                  </div>

                  {error && (
                    <div className="cr-error-box flex items-center gap-2 text-xs">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="cr-btn-primary w-full h-12 text-base"
                    disabled={!email.includes('@') || loading}
                  >
                    {loading ? "Sending OTP..." : "Get OTP on Email"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.form>
            )}

            {stage === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOtp}
              >
                <div className="space-y-4">
                  <button 
                    type="button" 
                    onClick={() => { setStage("email"); setError(null); }}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-2"
                  >
                    <ArrowLeft size={12} /> Wrong email?
                  </button>

                  <div>
                    <label className="cr-label block uppercase tracking-wider mb-2">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="cr-input text-center tracking-[1em] text-2xl"
                      required
                      autoFocus
                    />
                    <p className="text-xs text-center text-slate-500 mt-3 font-medium">Sent to {email}</p>
                  </div>

                  {error && (
                    <div className="cr-error-box flex items-center justify-center gap-2 text-xs">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="cr-btn-primary w-full h-12 text-base bg-emerald-500 hover:bg-emerald-600"
                    disabled={otp.length !== 6 || loading}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </Button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
