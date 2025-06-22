import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    // Добавляем текущий путь в заголовки для использования в layout
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    // Редиректы с старых путей на новые
    if (request.nextUrl.pathname.startsWith('/Admin/TimeTableAdmin')) {
        return NextResponse.redirect(new URL('/business/englishpro/admin/timetable', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/Admin/ProfileAdmin')) {
        return NextResponse.redirect(new URL('/business/englishpro/admin/profile', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/User/TimeTable')) {
        return NextResponse.redirect(new URL('/business/englishpro/user/timetable', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/User/Profile')) {
        return NextResponse.redirect(new URL('/business/englishpro/user/profile', request.url));
    }

    // Защищенные пути
    const protectedPaths = [
        '/Admin',
        '/User',
        '/business/englishpro/admin',
        '/business/englishpro/user'
    ];

    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isProtectedPath) {
        const token = await getToken({ req: request });

        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(url);
        }

        // Проверка роли для админских путей
        if (request.nextUrl.pathname.startsWith('/Admin') || request.nextUrl.pathname.startsWith('/business/englishpro/admin')) {
            if (token.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
