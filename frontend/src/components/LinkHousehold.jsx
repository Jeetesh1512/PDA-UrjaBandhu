"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";

export default function LinkHouseholdPage() {
  const [consumerId, setConsumerId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!consumerId.trim()) {
      setError("Please enter a Consumer ID");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();
      const { data: userData, error: userError } =
        await supabase.auth.getSession();
      const token = userData?.session?.access_token;

      const res = await axios.post(
        `http://localhost:8080/api/household/send-house-verification-otp/${consumerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data || res.data.error) {
        throw new Error(res.data.error || "Failed to send OTP");
      }

      setSuccess(res.data);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getSession();
      const token = userData?.session?.access_token;

      const res = await axios.post(
        `http://localhost:8080/api/household/verifyOtpForHouse/${consumerId}`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data || res.data.error) {
        throw new Error(res.data.error || "Invalid OTP");
      }

      setSuccess(res.data.success);
      setTimeout(() => {
        window.location.href = "/basic_user/dashboard";
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url(/home-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="backdrop-blur-sm bg-gray-900/50 rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Link Your Household
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              {!otpSent
                ? "Enter your Consumer ID to get started"
                : "Enter the OTP sent to your household email"}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm animate-pulse">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/30 backdrop-blur-sm border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm animate-pulse">
                {success}
              </div>
            )}

            {!otpSent ? (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="consumerId"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Consumer ID
                  </label>
                  <input
                    id="consumerId"
                    name="consumerId"
                    type="text"
                    value={consumerId}
                    onChange={(e) => setConsumerId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendOTP(e)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/80 backdrop-blur-sm rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your Consumer ID"
                    disabled={loading}
                  />
                </div>

                <div>
                  <button
                    onClick={handleSendOTP}
                    disabled={loading || !consumerId.trim()}
                    className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Sending OTP...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleVerifyOTP(e)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/80 backdrop-blur-sm rounded-md text-center tracking-widest focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="123456"
                    maxLength="6"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Consumer ID: {consumerId}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleBack}
                    disabled={loading}
                    className="flex-1 py-2 px-4 text-sm font-medium rounded-md text-gray-300 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="flex-1 flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
