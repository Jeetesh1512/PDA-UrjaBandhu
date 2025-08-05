import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import BasicUserNavbar from "@/components/BasicUserNavbar";
import { redirect } from "next/navigation";

export default async function BasicUserLayout({ children }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  if (!token) {
    throw new Error(
      JSON.stringify({
        message: "You must be logged in to access the user dashboard.",
        source: "User Dashboard",
      })
    );
  }

  try {
    const res = await axios.get(`http://localhost:8081/auth/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = res?.data?.user;
    const role = user?.role;
    const basicUser = user?.basicUser;

    if (role !== "BASIC_USER") {
      throw new Error(
        JSON.stringify({
          message: "Access denied. Authenticated users only.",
          source: "User Dashboard",
        })
      );
    }

    if (!basicUser) {
      redirect("/link-household");
    }
  } catch (err) {
    throw new Error(
      JSON.stringify({
        message: "Error Verifying User",
        source: "User Dashboard",
      })
    );
  }

  return (
    <>
      <BasicUserNavbar />
      <div className="pt-16">{children}</div>
    </>
  );
}
