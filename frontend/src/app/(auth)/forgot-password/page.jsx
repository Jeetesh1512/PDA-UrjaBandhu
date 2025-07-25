"use client";
import { useState } from "react";
import { resetPassword } from "./actions";
import Link from "next/link";
import AuthSideBanner from "@/components/AuthSideBanner";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [sent,setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);

    const res = await resetPassword(formData);

    if (res?.error) {
      setError(res.error);
      setMessage(null);
    } else {
      setMessage(res.message);
      setError(null);

      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full lg:w-1/3 bg-neutral-900 p-10 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-amber-50 font-mono font-extrabold">PDA Ltd.</h1>
          <img src="/logo.png" className="w-10 h-10" alt="icon" />
        </div>

        <form className="space-y-4 p-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>

          <input
            type="email"
            placeholder="Enter your email to reset"
            required
            value={email}
            disabled={sent}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full disabled:cursor-not-allowed focus:outline-none placeholder:text-gray-300 bg-neutral-700 h-10 p-3"
          />

          {error && <p className="text-red-500 text-xl">{error}</p>}
          {message && <p className="text-green-500 text-xl">{message}</p>}

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
