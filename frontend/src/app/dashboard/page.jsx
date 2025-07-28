"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import LocationMap from "@/components/LocationMap";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const role = useSelector((state) => state.auth.role);
  const [households, setHouseholds] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (!data?.user || error) {
        router.push("/");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const resHouse = await axios.get(
          `http://localhost:8080/api/household/power-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resIncidents = await axios.get(
          `http://localhost:8080/api/incident/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIncidents(resIncidents?.data?.incidents);
        setHouseholds(resHouse?.data?.households);
      } catch (error) {
        console.error("Failed to fetch power statuses", error);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (role === "ADMIN")
    return (
      <>
        <LocationMap incidents={incidents} />
      </>
    );
  if (role === "BASIC_USER") return <h1>Basic_user Dashboard</h1>;
  if (role === "LINEMAN") return <h1>Lineman Dashboard</h1>;

  return <h1>Unauthorized</h1>;
}
