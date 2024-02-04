'use server'
 
import { cookies } from 'next/headers'
 
export async function create(name, value) {

  cookies().set({
    name: name,
    value: value,
    httpOnly: true,
    path: '/',
  })
}