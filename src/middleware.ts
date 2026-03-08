import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if maintenance mode is enabled
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

    const pathname = request.nextUrl.pathname;
    const isMaintenancePage = pathname === '/maintenance';

    // Exclude API routes and Admin routes from maintenance block
    // We want the admin to still be able to manage bookings during maintenance
    const isApiRoute = pathname.startsWith('/api');
    const isAdminRoute = pathname.startsWith('/admin');

    // If maintenance is ON and this is a normal public page, redirect to /maintenance
    if (isMaintenanceMode && !isMaintenancePage && !isApiRoute && !isAdminRoute) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
    }

    // If maintenance is OFF but we try to access the maintenance page, redirect to home
    if (!isMaintenanceMode && isMaintenancePage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Match all routes except static assets
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
}
