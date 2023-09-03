import type { NextApiRequest, NextApiResponse } from 'next'
import getAuthorizationUrl from '../../../node_modules/next-auth/core/lib/oauth/authorization-url';
import { init } from './../../../node_modules/next-auth/core/init';
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server';
import { env } from 'process';
import { stringify } from 'querystring';
import { getCsrfToken, getProviders } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]/route';

type ResponseData = {
  message: string
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const headersList = headers();
    const callbackUrl = searchParams.get('callbackUrl') ?? 'http://localhost:3000';

    const requestCookies = cookies().getAll().map(x => ({[x.name]: x.value})) as unknown as Record<string, string>;

    const { cookies: initCookies, options } = await init({
        action: 'signin',
        authOptions,
        isPost: true,
        cookies: requestCookies,
        csrfToken: await getCsrfToken(),
        callbackUrl: callbackUrl,
        providerId: 'idsrv'
    })
    const {redirect: redirectUrl, cookies: authCookies } = await getAuthorizationUrl({
        options,
        query: {}
    })

    const redirectResponse = NextResponse.redirect(redirectUrl, { status: 302 });
    [...authCookies || [], ...initCookies].forEach(cookie => redirectResponse.cookies.set(cookie.name, cookie.value));
    return redirectResponse;
}
