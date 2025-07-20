"use client"
import { supabase } from "@/utils/supabase-client";
import { useEffect, useState } from "react";

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
                <h1>Signed In</h1>
            ) : (
                <h1>Not Signed In</h1>
            )}
        </>
    )
}