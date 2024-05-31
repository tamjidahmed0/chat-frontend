'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers';
import action from '@/app/actions'


export default async function ImageUpload (formData) {
 
    
        const cookieStore = cookies()
        const userId = cookieStore.get('c_user').value



    const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/test/${userId}?type=profile`,
    {
        method: 'POST',

          body: formData,
    
  
       
        }, { cache: 'no-store', })

        
if(result.status === 201){

}

   
        return result.json()

    
}