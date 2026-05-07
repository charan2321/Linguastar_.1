import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function proxy(req) {
    const response = NextResponse.next()

    const token = req.cookies.get('sb-access-token')

    // =========================================
    // PROTECTED ROUTES
    // =========================================

    const protectedRoutes = [
        '/dashboard',
        '/admin',
        '/reader'
    ]

    const isProtected = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    )

    // =========================================
    // REDIRECTS based on Auth State
    // =========================================

    const isLoginRoute = req.nextUrl.pathname.startsWith('/login')

    if (isLoginRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (isProtected && !token) {
        return NextResponse.redirect(
            new URL('/login', req.url)
        )
    }

    // =========================================
    // ADMIN SECURITY
    // =========================================

    if (req.nextUrl.pathname.startsWith('/admin')) {

        if (!token) {
            return NextResponse.redirect(
                new URL('/login', req.url)
            )
        }

        try {

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )

            // validate user from token
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser(token.value)

            if (userError || !user) {
                return NextResponse.redirect(
                    new URL('/login', req.url)
                )
            }

            // check admin table
            const { data: admin } = await supabase
                .from('admins')
                .select('id')
                .eq('user_id', user.id)
                .single()

            // not admin
            if (!admin) {
                return NextResponse.redirect(
                    new URL('/dashboard', req.url)
                )
            }

        } catch (err) {
            console.error('Middleware Error:', err)

            return NextResponse.redirect(
                new URL('/login', req.url)
            )
        }
    }

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/reader/:path*',
        '/login'
    ]
}
