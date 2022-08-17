import { destroyCookie, parseCookies } from 'nookies';
import decode from 'jwt-decode';
import { AuthTokenError } from '../errors/AuthTokenError';
import { validateUserRolesPermissions } from '../utils/validateUserRolesPermissions';

export function withSSRAuth(fn, options) {
  return async (context) => {
    const cookies = parseCookies(context);
    const access_token = cookies['@web-app-access-token'];

    if (!access_token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  
    if (options) {
      const user = decode(access_token);
      const { permissions, roles } = options

      const userHasValidPermissions = validateUserRolesPermissions({
        user,
        permissions, 
        roles 
      })

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          }
        }
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
