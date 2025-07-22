"use client"
import { supabase } from "@/utils/supabase-client";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard/page";
import Login from "./(auth)/login/page";

export default function Home() {
    const [session, setSession] = useState(null);

    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession();
        setSession(currentSession.data.session)
    }

    useEffect(() => {
        fetchSession();
    }, []);

    useEffect(() => {
        console.log(session);
    }, [session]);

    return (
        <>
            {session ? (
                <Dashboard/>
            ) : (
                <Login/>
            )}
        </>
    )
}