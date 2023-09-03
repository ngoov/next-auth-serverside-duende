import { getCsrfToken, getProviders } from 'next-auth/react';

export default async function Page(){
    const providers = await getProviders();
    const csrfToken = await getCsrfToken();
    const provider = providers!['idsrv']!;
    await fetch(provider?.signinUrl, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          // @ts-expect-error
          body: new URLSearchParams({
            csrfToken: await getCsrfToken(),
            callbackUrl: provider.callbackUrl,
            json: true,
          })
    })
    return <div>{JSON.stringify(providers)}</div>;
}
