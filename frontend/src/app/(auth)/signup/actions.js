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

  const { error } = await supabase.auth.signUp(signupData)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
