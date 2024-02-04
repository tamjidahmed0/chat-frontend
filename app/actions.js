'use server'
 
import { cookies } from 'next/headers'
 
export default async function create(name, value) {

  cookies().set({
    name: name,
    value: value,
    httpOnly: true,
    path: '/',
   
    
  })
  
}
