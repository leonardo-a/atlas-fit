import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

import { SignInForm } from '@/components/sign-in-form'
import { useAuth } from '@/contexts/auth-context'
import Logo from '/logo.svg'

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
      <div className="flex flex-col items-center justify-center h-dvh bg-lime-300 dark:bg-lime-500">
        <div className="flex flex-col justify-between w-full p-6 h-56 gap-4 lg:h-auto max-w-lg lg:flex-row-reverse lg:items-center">
          <img src={Logo} height={52} width={52} className="mx-auto brightness-0 opacity-80" />

          <div className="lg:flex-1">
            <h1 className="text-4xl font-black font-display text-slate-950">Entrar</h1>
            <p className="font-medium opacity-70 text-slate-800">Acesse sua conta e veja seus treinos</p>
          </div>

        </div>
        <div className="bg-slate-100 dark:bg-slate-900 shadow-md max-w-lg w-full p-8 space-y-6 lg:rounded-lg flex-1 lg:flex-0">
          <SignInForm />
          <p className="text-center text-sm opacity-60">
            não possui conta?{' '}
            <Link to="/cadastro" className="font-semibold text-lime-400 hover:text-lime-500">
              cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
