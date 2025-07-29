"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import AuthSideBanner from "@/components/AuthSideBanner";
import Image from "next/image";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full lg:w-1/3 bg-neutral-900 p-10 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-amber-50 font-mono font-extrabold">PDA Ltd.</h1>
          <Image src="/logo.png" className="w-10 h-10" alt="icon" />
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>

          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full focus:outline-none placeholder:text-gray-300 bg-neutral-700 h-10 p-3"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full focus:outline-none placeholder:text-gray-300 bg-neutral-700 h-10 p-3"
          />

          <div className="flex m-4 items-center justify-center">
            <button
              type="submit"
              className="bg-cyan-700 text-amber-50 font-extrabold p-1.5 hover:cursor-pointer hover:bg-blue-600 px-5 rounded-xl text-xl"
            >
              Update Password
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">You'll be redirected after success</p>
          </div>
        </form>

        <div>
          <p className="text-gray-500">@2025 PDA LTD., ALL RIGHTS RESERVED</p>
        </div>
      </div>

      <AuthSideBanner/>
    </div>
  );
}