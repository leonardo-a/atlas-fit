import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Header } from '@/components/header'
import { SignInForm } from '@/components/sign-in-form'
import { useAuth } from '@/contexts/auth-context'

export function SignIn() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <Header />
      <div className="grid place-items-center gap-4 h-dvh p-4 bg-orange-100">
        <div className="bg-slate-100 shadow-md max-w-lg w-full rounded-md p-4 space-y-6">
          <h2 className="place-self-center text-xl font-bold">Entrar</h2>
          <SignInForm />
        </div>
      </div>
    </>
  )
}
