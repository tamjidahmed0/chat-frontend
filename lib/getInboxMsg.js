'use server'
import { cookies } from 'next/headers'

export default async function getInboxMsg (userId, userID2) {

    const cookieStore = cookies()
    const user = cookieStore.has('token')
    const hasUser = cookieStore.has('c_user')
    const token = cookieStore.get('token')



    if(hasUser && user){

        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/message/${userId}/${userID2}?limit=30&offset=0`,
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