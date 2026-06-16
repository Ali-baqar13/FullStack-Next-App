// import { NextRequest,NextResponse } from "next/server";

// import { getToken } from "next-auth/jwt";
// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {

//     const token = await getToken({ req: request })
//     const url = request.nextUrl
//     if (token &&
//         (
//         url.pathname === "/sign-in" ||
//         url.pathname === "/sign-up" ||
//         url.pathname === "/" ||
//         url.pathname.startsWith("/dashboard") ||
//         url.pathname.startsWith("/verify")
//         )
//     ) {
//         return NextResponse.redirect(new URL("/dashboard", request.url));

//     }
//   return NextResponse.redirect(new URL("/home", request.url));
// }

// export const config = {
//   matcher: ["/sign-in", '/sign-up', '/', '/dashboard/:path*','/verify/:path*'],
// };

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If logged in and trying to access auth pages
  // if (token && (url.pathname === "/sign-up" || url.pathname === "/sign-in")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // Protect dashboard routes
  // if (!token && url.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // Allow request normally
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*"],
};