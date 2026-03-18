"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (authMethod === "phone") {
        if (!otpSent) {
          const { error } = await supabase.auth.signInWithOtp({ phone });
          if (error) throw error;
          setOtpSent(true);
          setSuccessMsg("Check your phone for the SMS login code!");
        } else {
          // Verify code
          const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
          if (error) throw error;
          router.push("/setup");
        }
        return;
      }
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/setup");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setErrorMsg("Check your email for the confirmation link!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/setup`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Could not login with Google");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center pt-16 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h1>

      <form onSubmit={handleSubmit} className="glass-panel w-full p-8 flex flex-col gap-6">
        {errorMsg && (
          <div className="p-3 rounded bg-red-900/30 border border-red-500/30 text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded bg-green-900/30 border border-green-500/30 text-green-400 text-sm text-center">
            {successMsg}
          </div>
        )}

        <div className="flex bg-gray-900 rounded-lg p-1 mb-2">
          <button type="button" onClick={() => { setAuthMethod("email"); setErrorMsg(""); setSuccessMsg(""); setOtpSent(false); }}
            className={`flex-1 py-2 text-sm rounded ${authMethod === "email" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>
            Email
          </button>
          <button type="button" onClick={() => { setAuthMethod("phone"); setErrorMsg(""); setSuccessMsg(""); setIsLogin(true); setOtpSent(false); }}
            className={`flex-1 py-2 text-sm rounded ${authMethod === "phone" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}>
            Phone
          </button>
        </div>

        {authMethod === "email" ? (
          <>
            <div>
              <label className="label-text">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
               <label className="label-text">Password</label>
               <input
                 type="password"
                 className="input-field"
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 disabled={loading}
               />
            </div>
          </>
        ) : (
          <div>
            {!otpSent ? (
              <>
                <label className="label-text">Phone Number</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">We will send a one-time login code via SMS.</p>
              </>
            ) : (
              <>
                <label className="label-text">Enter 6-digit Code</label>
                <input
                  type="text"
                  className="input-field text-center tracking-[0.5em] font-bold text-xl"
                  placeholder="••••••"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={loading}
                />
              </>
            )}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary py-3 text-lg w-full flex justify-center items-center">
          {loading ? "Please wait..." : (authMethod === "phone" ? (otpSent ? "Verify & Login" : "Send SMS Code") : (isLogin ? "Sign In" : "Sign Up"))}
        </button>
      </form>
    </div>
  );
}
