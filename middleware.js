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

    // Проверка авторизации для защищенных путей
    const token = await getToken({ req: request });
    const path = request.nextUrl.pathname;

    // Извлечение slug бизнеса из URL, если он есть
    const businessSlugMatch = path.match(/^\/business\/([^\/]+)/);
    const businessSlug = businessSlugMatch ? businessSlugMatch[1] : null;

    // Проверка доступа к админ-панели бизнеса
    if (path.includes('/admin')) {
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(url);
        }

        // Только admin и business могут получить доступ к админ-панели
        if (token.role !== 'admin' && token.role !== 'business') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Если это business, нужно проверить, владеет ли он этим бизнесом
        // Эта проверка должна быть реализована на стороне сервера в API-маршрутах
    }

    // Проверка доступа к пользовательским страницам бизнеса
    if (path.includes('/user') && !path.endsWith('/login') && !path.endsWith('/register')) {
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(url);
        }
    }

    // Доступ к панели администратора
    if (path.startsWith('/dashboard')) {
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(url);
        }

        if (token.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
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
