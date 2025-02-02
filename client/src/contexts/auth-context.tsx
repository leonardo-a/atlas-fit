import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { CookiesHelper } from '@/utils/cookies-helper'
import { getPayloadFromToken } from '@/utils/get-payload-from-token'

type UserRoles = 'STUDENT' | 'PERSONAL_TRAINER' | 'ADMIN'

interface User {
  id: string;
  name: string
  shortName: string
  role: UserRoles
}

interface AuthContextType {
  user: User | null | undefined
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Novo estado

  function login(token: string) {
    const { sub, role, name } = getPayloadFromToken(token)

    setUser({
      role,
      id: sub,
      name,
      shortName: name.split(' ')[0],
    })

    CookiesHelper.setCookie('authToken', token, 7)
  }

  function logout() {
    setUser(null)
    CookiesHelper.deleteCookie('authToken')
  }

  const isAuthenticated = !!user

  useEffect(() => {
    const token = CookiesHelper.getCookie('authToken')

    if (token) {
      try {
        login(token)
      } catch (err) {
        console.log(err)
        CookiesHelper.deleteCookie('authToken')
      }
    }
    setLoading(false) // Define como falso após a verificação
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {!loading && children} {/* Só renderiza o app quando não estiver carregando */}
    </AuthContext.Provider>
  )
}

// Hook para acessar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
