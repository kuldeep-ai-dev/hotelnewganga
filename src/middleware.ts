import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'

// Note: Full middleware protection usually requires @supabase/ssr or auth-helpers
// This is a placeholder for future implementation if server-side auth is needed.
export function middleware(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
