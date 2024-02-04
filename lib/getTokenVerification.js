'use server'
import { cookies } from 'next/headers'
export default async function getAllChat (token) {
    // const cookieStore = cookies()
    // const token = cookieStore.get('token')

  

    const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/verifytoken`,
    {
        method:'POST',
        headers:{
            'Authorization': `Bearer ${token}`,
        }
    }
    )
    return result.json()
}