import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import Router from 'next/router';

import { api } from "../services/apiClient"

//* TYPES
type User = { name: string; email: string; }
type Credentials = { email: string; password: string; }

type AuthContextData = {
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => void;
  user: User | undefined;
  isAuthenticated: boolean;
}
type AuthProviderProps = { children: ReactNode; }

//* CONTEXT
const AuthContext = createContext({} as AuthContextData)

//* SIGN OUT HELPER FUNCTION
export function signOut() {
  destroyCookie(undefined, 'booktracker.token')
  Router.push('/login')
}

//* COMPONENT
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const { 'booktracker.token': token } = parseCookies()

    if (token) {
      api.get<User>('/users/me').then(res => {
        const { name, email } = res.data
        setUser({ name, email })
      }).catch(() => {
        if (process.browser) signOut()
      })
    }

  }, [])


  async function signIn(credentials: Credentials) {
    const res = await api.post('session', credentials)
    const { token, user } = res.data

    setCookie(undefined, 'booktracker.token', token, {
      maxAge: 60 * 30, //? 30 minutes,
      path: '/'
    })
    setUser({ name: user.name, email: user.email })
    api.defaults.headers.common.authorization = `Bearer ${token}`
    Router.push('/books');
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

//* CUSTOM HOOK
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}