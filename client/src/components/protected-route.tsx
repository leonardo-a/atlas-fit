import { ReactNode } from 'react'
import { Navigate } from 'react-router'

import { useAuth } from '@/contexts/auth-context'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()

  if (user === undefined) {
    return null // Aguarda a autenticação ser processada antes de renderizar
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" />
  }

  return children
}
