'use server'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData) {
  const supabase = await createClient()

  const signupData = {
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: {
        name: formData.get('name'),
      },
    },
  }

  const { data,error } = await supabase.auth.signUp(signupData)
  console.log(data);
  console.log(error);

  if (error) {
    return { error: error.message }
  }

  if(!data?.session){
    return {error:"User already exists"}
  }

  return { success: true }
}
