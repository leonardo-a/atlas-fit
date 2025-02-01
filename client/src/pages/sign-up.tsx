import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { SignUpForm } from '@/components/sign-up-form'
import { useAuth } from '@/contexts/auth-context'
import { Dumbbell } from 'lucide-react'

export function SignUp() {
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

          <div className="space-y-2">
            <h1 className="text-4xl font-black font-display">Novo Usuário</h1>
            <p className="font-medium leading-tight opacity-60">Cadastre-se para começar a acompanhar suas rotinas de treino</p>
          </div>

        </div>
        <div className="bg-slate-100 shadow-md max-w-lg w-full p-4 space-y-6 lg:rounded-lg flex-1 lg:flex-0">
          <SignUpForm />
        </div>
      </div>
    </>
  )
}
