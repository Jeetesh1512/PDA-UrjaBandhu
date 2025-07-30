"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { authUser } from "@/redux/slices/authslice";
import { createClient } from "@/utils/supabase/client";

export default function ConfirmLanding() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log("hi");
    async function fetchAndStoreUser() {
      try {
        const supabase = await createClient();
        const { data: userData, error: userError } =
          await supabase.auth.getSession();
        console.log(userData);
        const token = userData?.session?.access_token;

        if (token) {
          const { data } = await axios.get(
            "http://localhost:8081/auth/user/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(data);
          const { user } = data;
          dispatch(authUser({ user, role: user.role }));

          router.push(`/${user.role.toLowerCase()}/dashboard`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/error");
      }
    }

    fetchAndStoreUser();
  }, [dispatch, router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-8 p-8 max-w-md">
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">
            Verifying Account
          </h1>

          <p className="text-gray-400 leading-relaxed">
            Please wait while we authenticate your session and prepare your
            dashboard.
          </p>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <div className="text-blue-400 font-medium">
            Verifying and redirecting...
          </div>

          {/* Simple loading dots */}
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
