import { parseCookies } from "nookies";

export function withSSRGuest(fn) {
  return async (context) => {
    const cookies = parseCookies(context);

    if (cookies['@web-app-access-token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
    }
  
    return await fn(context);
  }
}
