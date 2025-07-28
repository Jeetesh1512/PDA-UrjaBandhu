"use client";
import { useState } from "react";
import { login } from "./actions";
import axios from "axios";
import Link from "next/link";
import {authUser} from '@/redux/slices/authslice'
import { useRouter } from "next/navigation";
import AuthSideBanner from "@/components/AuthSideBanner";
import { useDispatch } from "react-redux";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.set("email", credentials.email);
      formData.set("password", credentials.password);

      const { token } = await login(formData);

      const res = await axios.get(`http://localhost:8081/auth/user/me`,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });


      const user = res.data?.user

      dispatch(
        authUser({
          user,
          token,
          role:user.role,
        })
      );

      router.push('/dashboard');

    } catch (error) {
      console.error("Login Error", error);
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

        <div>
          <h1 className="text-2xl text-amber-50 font-semibold mb-6">
            Login here
          </h1>
          <form onSubmit={handleLogin} className="space-y-4 p-6">
            <input
              onChange={handleChange}
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              placeholder="Enter your email"
              required
              className="w-full focus:outline-none placeholder:text-gray-300 bg-neutral-700 h-10 p-3"
            />

            <div className="relative w-full">
              <input
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={credentials.password}
                required
                className="w-full focus:outline-none placeholder:text-gray-300 bg-neutral-700 h-10 p-3 pr-10"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <img className="h-7" src="/eye.png" alt="hide" />
                ) : (
                  <img className="h-7" src="/close.png" alt="show" />
                )}
              </span>
            </div>

            <Link
              className="hover:text-blue-500 hover:underline"
              href={"/forgot-password"}
            >
              Forgot Password?
            </Link>

            <div className="flex m-4 items-center justify-center">
              <button
                type="submit"
                className="bg-cyan-700 text-amber-50 font-extrabold p-1.5 hover:cursor-pointer hover:bg-blue-600 px-5 rounded-xl text-xl"
              >
                Login
              </button>
            </div>

            <div className="flex flex-row py-4 text-xl">
              <p className="mx-3 font-semibold text-gray-300">New user?</p>
              <Link
                href="/signup"
                className="text-cyan-800 hover:text-blue-400 hover:underline"
              >
                Sign up here
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
  );
}
