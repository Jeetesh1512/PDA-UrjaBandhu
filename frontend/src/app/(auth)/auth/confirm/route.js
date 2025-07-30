import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import axios from 'axios'
import { useDispatch } from 'react-redux'

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
                console.log(token);
                try {
                    const {data} = await axios.post(`http://localhost:8081/auth/user/signup`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const {newUser} = data;
                    console.log(newUser)
                } catch (error) {
                    console.error("Error Signing Up", error);
                }
            }
            return redirect('/confirm-landing');
        }
    }
    return redirect('/error')
}