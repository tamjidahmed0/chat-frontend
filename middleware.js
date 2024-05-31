
// import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'
// import  verifyToken  from '@/lib/getTokenVerification'
// import getProfileDetails from './lib/getProfileDetails'
// import remove from './components/deleteCookie'


 
// // This function can be marked `async` if using `await` inside
// export async  function middleware(request) {


  
//   // request.cookies.delete('token')
//   const response = NextResponse.next()


//  console.log(request.nextUrl.pathname, 'path')

//   const tokenCookie = request.cookies?.get('token')
//   const userCookie = request.cookies?.get('c_user')

//   const hasCookieToken = request.cookies?.has('token')
//   const hasOtpCookieToken = request.cookies?.has('sec')
//   const hasCookieUser = request.cookies?.has('c_user')

//   // if(!hasCookieToken && !hasCookieUser){
//   //   return NextResponse.redirect(new URL('/', request.url))
//   // }



//   const logedInUserNotAccess = request.nextUrl.pathname === '/'


//   if(logedInUserNotAccess){
//     if(hasCookieToken){
//       return NextResponse.redirect(new URL('/messages', request.url))
//     }
//   }else if (!hasCookieToken ){
      
//       return NextResponse.redirect(new URL('/', request.url))
    
//   }


//   const logedInUserNotAccessOtpPage = request.nextUrl.pathname === '/checkpoint'
 
//   if(logedInUserNotAccessOtpPage){
//     if(hasCookieToken){
//       // return NextResponse.redirect(new URL('/checkpoint', request.url))
//       return NextResponse.redirect(new URL('/messages', request.url))
//       console.log('ase ase')
//     }
//   }else if(hasOtpCookieToken){
//     // return NextResponse.redirect(new URL('/checkpoint', request.url))
//     console.log('ase')

//   }



//     return response
  


  
// }
 
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ["/", '/checkpoint', "/messages/:path*", "/settings/:path*"],
// }




import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Extract the pathname from the request URL
  const { pathname } = request.nextUrl;

  // Check for the presence of cookies
  const hasTokenCookie = request.cookies.has('token');
  const hasOtpCookieToken = request.cookies.has('sec');

  // Define the logic for redirecting users based on their authentication status
  if (pathname === '/' || pathname === '/register') {
    // If the user is logged in, redirect them to the messages page
    if (hasTokenCookie) {
      return NextResponse.redirect(new URL('/messages', request.url));
    }
  } else if (pathname === '/checkpoint') {
    // Users should only be allowed on the checkpoint page if they have the OTP cookie and are not logged in
    if (!hasTokenCookie && hasOtpCookieToken) {
      // Allow users to proceed to the checkpoint page
      return NextResponse.next();
    } else {
      // Redirect all other users away from the checkpoint page
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (pathname.startsWith('/messages') || pathname.startsWith('/settings')) {
    // If the user is not logged in, redirect them to the home page
    if (!hasTokenCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // For all other cases, allow the request to continue
  return NextResponse.next();
}

// Define the paths that the middleware should match
export const config = {
  matcher: ['/', '/register', '/checkpoint', '/messages/:path*', '/settings/:path*'],
};

