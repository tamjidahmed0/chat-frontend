"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import action from "@/app/actions";

export default async function getLoginDetails(identifier, password, userAgent) {
  
 


  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'User-Agent': userAgent,
      },
      credentials: "include",

      body: JSON.stringify({
        identifier: identifier,
        password: password,
      }),
    },
    { cache: "no-store" }
  );

  if (result.status === 201) {
    const { token, id } = await result.json();
   
    action("token", token);
    action("c_user", id);

    console.log(token, id);

    redirect(`/messages`);
  } else {
  
    return result.json();
  }
}
