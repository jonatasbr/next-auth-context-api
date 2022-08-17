import axios from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../src/context/AuthContext';

let isRefreshing = false;
let failedRequestQueue = [];

export function getApi(context = undefined) {
  let cookies = parseCookies(context);

  const api = axios.create({
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
        cookies = parseCookies(context);
  
        const { '@web-app-refresh-token': refresh_token} = cookies;
        const original_config = error.config;
  
        if(!isRefreshing) {
          isRefreshing = true;
  
          api.post('/auth/refresh-token', {
            refresh_token
          }).then((response) => {
            const { access_token } = response.data;
    
            setCookie(context, '@web-app-access-token', access_token, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            });
            setCookie(context, '@web-app-refresh-token', response.data.refresh_token, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            });
    
            api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
  
            failedRequestQueue.forEach((request) => request.onSuccess(access_token));
            failedRequestQueue = []
          }).catch((err) => {
            failedRequestQueue.forEach((request) => request.onFailure(err));
            failedRequestQueue = []
  
            if (process.window) {
              signOut();
            }
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
        if (process.window) {
          signOut();
        }
      }
    }
    
    return Promise.reject(error);
  });

  return api;
}