// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_PATHS = [
//   '/auth/login',
//   '/auth/register',
//   '/auth/refresh',
// ];

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // skip static & api
//   if (
//     pathname.startsWith('/api') ||
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/icons')
//   ) {
//     return NextResponse.next();
//   }

//   // skip public routes
//   if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   // ստանում ենք access token (ոչ refresh)
//   const accessToken = req.cookies.get('access_token')?.value;

//   if (!accessToken) {
//     const loginUrl = new URL('/auth/login', req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!_next|favicon.ico).*)'],
// };