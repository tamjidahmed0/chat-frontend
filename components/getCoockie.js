'use server'
import { cookies } from "next/headers";


const getCookie = (value) => {
  const cookieStore = cookies();
  const token = cookieStore.get(value);
  return token;


};
export default getCookie


