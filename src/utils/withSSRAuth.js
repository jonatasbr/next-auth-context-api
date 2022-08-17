import { parseCookies } from 'nookies';

export function withSSRAuth(fn) {
  return async (context) => {
    const cookies = parseCookies(context);

    if (!cookies['@web-app-access-token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  
    return await fn(context);
  }
}
