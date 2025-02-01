import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

import { SignInForm } from '@/components/sign-in-form'
import { useAuth } from '@/contexts/auth-context'
import { Dumbbell } from 'lucide-react'

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
      <div className="flex flex-col items-center justify-center h-dvh bg-lime-300">
        {/* <Dumbbell /> */}
        <div className="flex flex-col justify-between w-full h-56 text-left  p-6">
          <Dumbbell size={36} className="mx-auto opacity-65" />

          <div>
            <h1 className="text-4xl font-black font-display">Entrar</h1>
            <p className="font-medium opacity-70">Acesse sua conta e veja seus treinos</p>
          </div>

        </div>
        <div className="bg-slate-100 shadow-md max-w-lg w-full p-4 space-y-6 lg:rounded-lg flex-1 lg:flex-0">
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
