'use client';

import { useEffect } from "react";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="p-10 text-red-600">
      <h2 className="text-2xl font-bold">Error</h2>
      <p className="mt-4">{error.message ?? "Something went wrong."}</p>
      <button
        onClick={reset}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}
