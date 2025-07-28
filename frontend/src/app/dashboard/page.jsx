"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import LocationMap from "@/components/LocationMap";

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

    const households = [
    { lat: 32.8800, lng: 74.7800, powerStatus: 'ON' },
    { lat: 28.62, lng: 77.22, powerStatus: 'OFF' },
  ];

  const incidents = [
    { lat: 28.615, lng: 77.215, description: 'Transformer Failure' },
    { lat: 28.625, lng: 77.225, description: 'Line Cut' },
  ];

  if (role === "ADMIN") return (
    <>
      <LocationMap households={households} incidents={incidents}/>
    </>
  )
  if (role === "BASIC_USER") return <h1>Basic_user Dashboard</h1>;
  if (role === "LINEMAN") return <h1>Lineman Dashboard</h1>;

  return <h1>Unauthorized</h1>;
}
