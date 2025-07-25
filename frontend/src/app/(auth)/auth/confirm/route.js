import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import axios from 'axios'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const next = searchParams.get('next') ?? '/'

    if (token_hash && type) {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {

            const token = data.session.access_token;

            if (token) {
                try {
                    await axios.post(`http://localhost:8081/api/user/signup`, {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error Signing Up", error);
                }
            }

            return redirect(next)
        }
    }
    return redirect('/error')
}