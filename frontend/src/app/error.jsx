"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Error({ error, reset }) {
  const router = useRouter();

  let parsedError = {};

  try {
    parsedError = JSON.parse(error.message);
  } catch {
    parsedError = {
      message: error.message || "Unknown error",
      source: "unknown",
    };
  }

  useEffect(() => {
    console.error("Error from:", parsedError?.source || "unknown", error);
  }, [error, parsedError?.source]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center border border-red-700">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* Error Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-lg">
              An error occurred in the{" "}
              <span className="text-red-400 font-medium">
                {parsedError?.source || "unknown"}
              </span>{" "}
              page
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-gray-700/50 rounded-lg p-6 mb-8 border border-gray-600">
            <h3 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wide">
              Error Details
            </h3>
            <div className="bg-gray-900/50 rounded p-4 border border-gray-600">
              <p className="text-red-300 font-mono text-sm leading-relaxed break-words">
                {parsedError.message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reload Page
            </button>
            <Link href="/login" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]">
              Go To Login
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400 mb-2">
              If this problem persists, please contact support
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>
                Error ID: {Math.random().toString(36).substring(2, 9)}
              </span>
              <span>•</span>
              <span>Timestamp: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
