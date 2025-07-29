'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()
  const userInfo = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { data,error } = await supabase.auth.signInWithPassword(userInfo)

  if (error || !data?.session) {
    redirect('/error')
  }

  const token = data.session.access_token;

  return {token}
}
