import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../errors/AuthTokenError';

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
  
    try {
      return await fn(context);
    } catch(err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(context, '@web-app-access-token');
        destroyCookie(context, '@web-app-refresh-token');
    
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
    }
  }
}
