"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase-client";
import Link from "next/link";
import AuthSideBanner from "@/components/AuthSideBanner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent! Check your email.");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full lg:w-1/3 bg-neutral-900 p-10 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-amber-50 font-mono font-extrabold">
            PDA Ltd.
          </h1>
          <img src="/logo.png" className="w-10 h-10" alt="icon" />
        </div>

        <form onSubmit={handleReset} className="space-y-4 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Forgot Password?
          </h2>

          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <input
            type="email"
            placeholder="Enter your email to reset"
            required
            value={email}
            disabled={!!message}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full disabled:cursor-not-allowed focus:outline-none placeholder:text-gray-300 bg-neutral-700 h-10 p-3"
          />

          <div className="flex m-4 items-center justify-center">
            <button
              type="submit"
              className="bg-cyan-700 text-amber-50 font-extrabold p-1.5 hover:cursor-pointer hover:bg-blue-600 px-5 rounded-xl text-xl"
            >
              Send Reset Link
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-cyan-800 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>

        <div>
          <p className="text-gray-500">@2025 PDA LTD., ALL RIGHTS RESERVED</p>
        </div>
      </div>

      <AuthSideBanner />
    </div>
  );
}
