// frontend/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("middleware token =>", req.nextauth.token);
    console.log("middleware nextUrl =>", req.nextUrl);
    const { token } = req.nextauth;
    const { pathname, origin} = req.nextUrl;

    // Only admin have access to dashboard
    if (pathname.startsWith("/dashboard") && token?.role !== "admin") {
      return NextResponse.redirect(`${origin}/unauthorized`);
    }
  },
  {
    callbacks: {
      // If `authorized` returns `true`, the middleware function will execute.
      authorized: ({ token }) => token !== null
    },
  }
)

export const config = { matcher: ["/quiz/:path*", "/dashboard/:path*"] }