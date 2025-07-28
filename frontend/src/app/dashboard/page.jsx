'use client'

import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";

export default async function Dashboard() {

  const role = useSelector(state=>state.auth.role);

  if(role==='ADMIN') return <h1>Admin Dashboard</h1>
  if(role==='BASIC_USER') return <h1>Basic_user Dashboard</h1>
  if(role==='LINEMAN')  return <h1>Lineman Dashboard</h1>

  return <h1>Unauthorized</h1>
}
