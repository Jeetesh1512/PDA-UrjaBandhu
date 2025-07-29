import { createClient } from "@/utils/supabase/server";
import axios from "axios";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  const token = data?.session?.access_token;

  if (!token) {
    throw new Error(
      JSON.stringify({
        message: "You must be logged in to access the admin dashboard.",
        source: "Admin",
      })
    );
  }

  try {
    const res = await axios.get(`http://localhost:8081/auth/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const role = res?.data?.user?.role;

    if (role !== "ADMIN") {
      throw new Error(
        JSON.stringify({
          message: "Access denied. Admins only.",
          source: "Admin",
        })
      );
    }
  } catch (err) {
    throw new Error(
      JSON.stringify({
        message: "Error verifying user.",
        source: "Admin",
      })
    );
  }

  return <>{children}</>;
}
