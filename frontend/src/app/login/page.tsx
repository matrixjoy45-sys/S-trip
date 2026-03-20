"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Check if the user is already logged in or comes back from Google Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.href = "/setup"
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

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
        window.location.href = "/setup";
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

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <div className="flex w-full">
          <button type="button" onClick={handleGoogleLogin} disabled={loading} className="btn-secondary w-full flex items-center justify-center gap-2 hover:bg-gray-700 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>
        </div>

        {authMethod === "email" && (
          <p className="text-center text-sm text-gray-400 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); setSuccessMsg(""); }}
              className="text-primary hover:text-white transition-colors underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
