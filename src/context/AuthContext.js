import Router from 'next/router';
import { createContext, useState } from 'react';
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
      const { permissions, roles } = response.data;
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
