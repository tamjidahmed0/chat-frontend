'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers';
import action from '@/app/actions'
import getCookie from '@/components/getCoockie';


export default async function updateUser (name, username) {

    const user = getCookie('c_user').value
    const token = getCookie('token').value


    const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/update/${user}`,
    {
        method: 'POST',
       
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            "userid": user,
      
          },

        body: JSON.stringify({
           name,
           username
          }),
        }, { cache: 'no-store', })

        


   
        return result.json()

    
}