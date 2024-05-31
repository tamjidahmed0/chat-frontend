'use server'
import { cookies } from 'next/headers'


const getProfileDetails =  async (userId) => {
    const cookieStore = cookies()

    const hasUser = cookieStore.has('c_user')
    const hasToken = cookieStore.has('token')

    console.log(userId, 'getprofile')

    if(hasToken && hasUser){
        const token = cookieStore.get('token')
        const user = cookieStore.get('c_user').value
    
       
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/profile/${userId}`,
            {
                method:'GET',
                // headers:{
                //     'Authorization': `Bearer ${token.value}`,
                //     "userid": user,
                // }
            }
            )


   

            return result.json()
        } catch (error) {
          
        }
    }


   


}

export default getProfileDetails