"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase-client";
import Link from "next/link";
import AuthSideBanner from "@/components/AuthSideBanner";

export default function SignUp() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSingup = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/mail-redirect`,
        data: {
          name: credentials.name,
        },
      },
    });

    if (error) {
      console.error("Error Signing up");
      return;
    }

    setSignupComplete(true);
    setCredentials({
      email: "",
      password: "",
      name: "",
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="w-full lg:w-1/3 bg-neutral-900 p-10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl text-amber-50 font-mono font-extrabold">
              PDA Ltd.
            </h1>
            <img src="/logo.png" className="w-10 h-10" alt="icon" />
          </div>
          <div>
            <h1 className="text-2xl text-amber-50 font-semibold mb-6">
              Sign Up here
            </h1>
            {signupComplete && (
              <div className="bg-green-700 text-white px-4 py-2 rounded mb-4 text-sm">
                Check your email to confirm your account. Redirecting to
                login...
              </div>
            )}

            <form onSubmit={handleSingup} className="space-y-4 p-6">
              <input
                onChange={handleChange}
                type="text"
                id="name"
                name="name"
                value={credentials.name}
                placeholder="Enter your full name"
                required
                className="w-full focus:outline-none  placeholder:text-gray-300 bg-neutral-700 h-10 p-3"
              />
              <input
                onChange={handleChange}
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                placeholder="Enter Valid email"
                required
                className="w-full focus:outline-none  placeholder:text-gray-300  bg-neutral-700 h-10 p-3"
              />
              <div className="relative w-full">
                <input
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  value={credentials.password}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$"
                  title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
                  required
                  className="w-full focus:outline-none placeholder:text-gray-300 bg-neutral-700 h-10 p-3 pr-10"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <img className="h-7" src="/eye.png" alt="hidden" />
                  ) : (
                    <img className="h-7" src="/close.png" alt="visible" />
                  )}
                </span>
              </div>

              <p className="text-gray-300 text-xs">
                Password requirements:8 characters including [A-Za-z0-9] and
                special character (e.g. !@#$).
              </p>

              <div className="flex m-4 items-center justify-center">
                <button
                  type="submit"
                  className="bg-cyan-700 text-amber-50 font-extrabold p-1.5 hover:cursor-pointer hover:bg-blue-600 px-5 rounded-xl text-xl"
                >
                  SignUp
                </button>
              </div>
              <div className="flex flex-row py-4 text-xl">
                <p className="mx-3 font-semibold text-gray-300">
                  Existing User?
                </p>
                <Link
                  href={"/login"}
                  className="text-cyan-800 hover:text-blue-400 hover:underline"
                >
                  {" "}
                  Login here
                </Link>
              </div>
            </form>
          </div>

          <div>
            <p className="text-gray-500">@2025 PDA LTD., ALL RIGHTS RESERVED</p>
          </div>
        </div>
        <AuthSideBanner />
      </div>
    </>
  );
}
