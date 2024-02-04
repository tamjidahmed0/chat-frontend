'use server'
import { cookies } from 'next/headers'
export default async function getAllChat (search) {
    const cookieStore = cookies()

    const hasUser = cookieStore.has('c_user')
    const hasToken = cookieStore.has('token')

    

    if(hasToken && hasUser){
        const token = cookieStore.get('token')
        const user = cookieStore.get('c_user').value
    
    
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/search/${user}?name=${search}`,
            {
                method:'GET',
                headers:{
                    'Authorization': `Bearer ${token.value}`,
                }
            }
            )
            return result.json()
        } catch (error) {
            return
        }
    }










   



   


}