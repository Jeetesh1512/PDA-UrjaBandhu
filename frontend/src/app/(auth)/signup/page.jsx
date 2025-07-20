"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase-client";
import Link from "next/link";

export default function SignUp() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSingup = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/mail-redirect`,
        data: {
          name: credentials.name,
        },
      },
    });

    if (error) {
      console.error("Error Signing up");
      return;
    }

    setCredentials({
      email: "",
      password: "",
      name: "",
    });
  };

  return (
    <>
      <h1>Sign Up here</h1>
      <form className="flex flex-row justify-center">
        <label htmlFor="name">Full Name: </label>
        <input
          onChange={handleChange}
          type="text"
          id="name"
          name="name"
          value={credentials.name}
          placeholder="Enter your full name"
          required
        />
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
        <button onClick={handleSingup}>SignUp</button>

        <p>Existing User? </p>
        <Link href={"/login"}> Login here</Link>
      </form>
    </>
  );
}
