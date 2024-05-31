'use server'
import action from '@/app/actions'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'




export default async function getRegisterDetails (name , username, email, password) {

    const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/register`,
    {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
credentials:'include',
        // headers: {
        //     'Content-Type': 'application/json',
            
        //   },


  
        body: JSON.stringify({
            name: name,
            username:username,
            email: email,
            password: password,
          }),
        }, { cache: 'no-store' })




if(result.status === 201){

  const {token , id, otpExpire} = await result.json()
 
  // action('sec' , token)


  cookies().set({
    name: 'sec',
    value: token,
    httpOnly: true,
    path: '/',
    // maxAge: 3 * 60 * 1000
    maxAge: otpExpire
    
  })


  // cookies().set('sec', token, { expires: Date.now() - 3 * 60 * 1000 })

 
 console.log(token, id)
 
 redirect(`/checkpoint`) 
 
 
 
 
 }

   
        return result.json()

    
}