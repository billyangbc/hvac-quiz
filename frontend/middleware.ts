import { withAuth } from "next-auth/middleware";
import { NextRequest,NextResponse } from 'next/server';
import { getToken, GetTokenParams } from 'next-auth/jwt';

export  default withAuth(
  async function middleware(req: NextRequest) {
//    console.log('middleware req ==>', req);
    
    let params: GetTokenParams = {
      req: req,
      secret: process.env.NEXTAUTH_SECRET ?? "secret",
    };
    if (process.env.NODE_ENV === "production") {
      params = {
        ...params,
        cookieName: "next-auth.session-token",//"__Secure-next-auth.session-token", // 🔒 Secure cookie for production
      };
    }

    const token = await getToken(params);
    console.log("middleware::params ==> ", params, 'getToken ==>', token);

    const { pathname, origin} = req.nextUrl;
    // Only admin have access to dashboard
    if (pathname.startsWith("/dashboard") && token?.roleName !== `${process.env.ADMIN_ROLE_NAME}`) {
      console.log("middleware::adminonly => ", token?.roleName);
      return NextResponse.redirect(`${origin}/unauthorized`);
    }

    // Else just pass through
    return NextResponse.next();
  },
  {
    callbacks: {
      // If `authorized` returns `true`, the middleware function will execute.
      authorized: async ({ req, token }) => {
//        console.log("**** middleware::callback::authorized param token ==>", token);
        return token !== null;
      }
    },
  }
);

export const config = { matcher: ["/quiz/:path*", "/dashboard/:path*", "/stats/:path*"] }