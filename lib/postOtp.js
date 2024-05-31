'use server'
import action from '@/app/actions'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import deleteCookie from '@/components/deleteCookie'



export default async function postOtp (otp) {
    const cookieStore = cookies()
    const token = cookieStore.get('sec')

    const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/otp`,
    {
        method: 'POST',

        headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
        },

        // headers: {
        //     'Content-Type': 'application/json',
            
        //   },


  
        body: JSON.stringify({
           otp:otp
          }),
        }, { cache: 'no-store' })




if(result.status === 201){

    const {token , id} = await result.json()
  await deleteCookie('sec')
 await action('token' , token)
 await action('c_user' , id)
  redirect(`/messages`)  

 
 
 
 }

   
 return result.json()

    
}