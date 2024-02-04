'use server'
 
import { cookies } from 'next/headers'
 
export default async function remove(data) {
  cookies().delete(data)
}