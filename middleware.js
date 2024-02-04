
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import  verifyToken  from '@/lib/getTokenVerification'



 
// This function can be marked `async` if using `await` inside
export async  function middleware(request) {

  console.log('middleware run')
  
  // request.cookies.delete('token')
  const response = NextResponse.next()

  const tokenCookie = request.cookies?.get('token')
  const userCookie = request.cookies?.get('c_user')

  const hasCookieToken = request.cookies?.has('token')
  const hasCookieUser = request.cookies?.has('c_user')


console.log(hasCookieToken, 'has cookie')



  const logedInUserNotAccess = request.nextUrl.pathname === '/'

  if(logedInUserNotAccess){
    if(hasCookieToken){
      return NextResponse.redirect(new URL('/messages', request.url))
    }
  }else if (!hasCookieToken){
    
      return NextResponse.redirect(new URL('/', request.url))
    
  }






  // const logedInUserNotAccess = request.nextUrl.pathname === '/'

  
    // if(logedInUserNotAccess){
    //   if(hasCookieToken){
    //     return NextResponse.redirect(new URL('/messages', request.url))
    //   }
    // }else{
    //   if(!hasCookieToken){
    //     return NextResponse.redirect(new URL('/', request.url))
    //   }
    // }



 
  
   



    if(hasCookieToken){

 
      const test = await verifyToken(tokenCookie.value)
      console.log(test)
  
  
      
      if(test.status === 401){
        console.log(test.status)
  
        console.log(request.cookies, '401,,')
     
     
        response.cookies.delete('token')
        response.cookies.delete('c_user')
       
       
        // return NextResponse.redirect(new URL('/', request.url))

      }else{
        console.log(test)
        // console.log(request.cookies)

if(hasCookieUser){
  if(test.id !== userCookie.value){

    response.cookies.delete('token')
    response.cookies.delete('c_user')


  }
}

    



      }
    }

  


  
















    return response
  


  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/messages/:path*"],
}