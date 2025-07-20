"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase-client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Error logging in!");
      return;
    }

    router.push("/")
    
  };

  return (
    <>
      <h1>Login here</h1>
      <form className="flex flex-row justify-center">
        <label htmlFor="email">Email: </label>
        <input
          onChange={handleChange}
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          placeholder="Enter Valid email"
          required
        />
        <label htmlFor="password">Password: </label>
        <input
          onChange={handleChange}
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          value={credentials.password}
          required
        />
        <button onClick={handleLogin}>Login</button>
        <p>New User? </p>
        <Link href={"/signup"}> Sign Up here</Link>
      </form>
    </>
  );
}
