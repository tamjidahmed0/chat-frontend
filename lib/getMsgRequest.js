'use server'
import { cookies } from 'next/headers'

export default async function getMsgRequest () {

    const cookieStore = cookies()
    const user = cookieStore.has('token')
    const hasUser = cookieStore.has('c_user')
    const token = cookieStore.get('token')

    const userId = cookieStore.get('c_user').value


    if(hasUser && user){

        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/messagereq/${userId}`,
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