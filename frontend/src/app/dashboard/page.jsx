"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const router = useRouter();
  const role = useSelector((state) => state.auth.role);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (!data?.user || error) {
        router.push("/");
        return;
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (role === "ADMIN") return <h1>Admin Dashboard</h1>;
  if (role === "BASIC_USER") return <h1>Basic_user Dashboard</h1>;
  if (role === "LINEMAN") return <h1>Lineman Dashboard</h1>;

  return <h1>Unauthorized</h1>;
}
