"use client"
import { supabase } from "@/utils/supabase-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Redirect(){
    const [session, setSession] = useState(null);
    const router = useRouter();

    const fetchsession = async () => {
        const currentSession = await supabase.auth.getSession();

        const token = currentSession.data.session?.access_token;

        if(token){
            setSession(token);
            
            const {data: {user}} = await supabase.auth.getUser();
            const email = user.email;
            const name = user.user_metadata?.name;

            try{
                await axios.post(`http://localhost:8081/api/user/signup`,{
                    name,
                },
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
                router.push("/");
            }catch(error){
                console.error("Error Signing Up",error);
            }
        }
    };

    useEffect(() => {
        fetchsession();
    },[router]);

    return <h1>Please Wait, you are being logged in</h1>
}