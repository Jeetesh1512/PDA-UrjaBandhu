'use server'

import { createClient } from '@/utils/supabase/server'

export async function resetPassword(formData) {
  const supabase = await createClient()
  const email = formData.get('email')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `http://localhost:3000/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { message: 'Reset link sent to your email address.' }
}
