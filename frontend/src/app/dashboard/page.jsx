import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "../(auth)/logout/actions";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
        <h1>In Dashboard</h1>

        <button onClick={logout}>Logout</button>
    </>
  )
}
