import axios from 'axios';
import { parseCookies } from 'nookies';

let cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['@web-app-access-token']}`
  }
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    if(error.response.data?.code === 'access-token.expired') {
      cookies = parseCookies();

      const { '@web-app-refresh-token': refresh_token} = cookies;

      api.post('/auth/refresh-token', {
        refresh_token
      }).then((response) => {
        const { access_token } = response.data;

        setCookie(undefined, '@web-app-access-token', access_token, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/'
        });
        setCookie(undefined, '@web-app-refresh-token', response.data.refresh_token, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/'
        });

        api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
      })
    } else {
      
    }
  }
});