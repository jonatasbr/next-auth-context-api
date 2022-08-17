import axios from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

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
      const original_config = error.config;

      if(!isRefreshing) {
        isRefreshing = true;

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

          failedRequestQueue.forEach((request) => request.onSuccess(access_token));
          failedRequestQueue = []
        }).catch((err) => {
          failedRequestQueue.forEach((request) => request.onFailure(err));
          failedRequestQueue = []
        }).finally(() => {
          isRefreshing = false;
        });
      }
      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          onSuccess: (access_token) => {
            original_config.headers['Authorization'] = `Bearer ${access_token}`;
            
            resolve(api(original_config));
          },
          onFailure: (err) => {
            reject(err);
          },
        })
      });
    } else {
      
    }
  }
});