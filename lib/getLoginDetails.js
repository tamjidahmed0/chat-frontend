'use server'

import { cookies } from 'next/headers';
import action from '@/app/actions'


export default async function getLoginDetails (email, password) {

    const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/login`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
          },


  
        body: JSON.stringify({
            email: email,
            password: password,
          }),
        }, { cache: 'no-store' })




   
        return result.json()

    
}