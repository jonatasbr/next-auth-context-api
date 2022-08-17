import { createContext, useState } from 'react';
import { setCookie } from 'nookies';
import Router from 'next/router';
import { api } from '../../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children })  {
  const [user, setUser] = useState();
  const isAuthenticated = !!user;

  async function signIn({ email, password }) {
    try {
      const response = await api.post('auth', {
        email, password
      });
      const { access_token, refresh_token, permissions, roles } = response.data;

      setCookie(undefined, '@web-app-access-token', access_token, {
        maxAge: 60 * 60 * 24,
        path: '/'
      });
      setCookie(undefined, '@web-app-refresh-token', refresh_token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });
      setUser({ email, permissions, roles });

      Router.push('/dashboard')
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
