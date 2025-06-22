import { NextResponse } from 'next/server';
import withAuth from 'next-auth/middleware';

export default withAuth(function middleware(req) {
    // Allow access to root path and login
    if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/login') {
        return;
    }

    // Check role-based access
    const rolePermissions = {
        user: ['/User'],
        specialist: ['/User', '/Admin/book'],
        manager: ['/User', '/Admin/book', '/Admin/TimeTableAdmin'],
        admin: ['/User', '/Admin']
    };

    const userRole = req.nextauth.token?.role;
    const currentPath = req.nextUrl.pathname;

    // Check if user has permission for the current path
    const hasPermission = rolePermissions[userRole]?.some(allowedPath =>
        currentPath.startsWith(allowedPath)
    );

    if (!hasPermission) {
        return NextResponse.redirect(new URL('/', req.url));
    }
});

export const config = {
    matcher: [
        '/User/:path*',
        '/Admin/:path*'
    ]
};
