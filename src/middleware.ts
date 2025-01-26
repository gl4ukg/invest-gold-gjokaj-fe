import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {routing} from './i18n/routing';

const defaultLocale = 'sq';
 
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    // Check if the request is for the root path
    if (request.nextUrl.pathname === '/') {
        // Redirect to the default locale
        return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }
 
    // For all other routes, use the intl middleware
    return intlMiddleware(request);
}
 
export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(sq|de|en)/:path*']
};