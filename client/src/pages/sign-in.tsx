import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SONNER_ERROR_STYLE } from '@/constants/sonner'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/axios'

export function SignIn() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      })

      login(response.data.access_token)
    } catch (loginErr) {
      let message = 'Erro no login.'

      if(loginErr instanceof AxiosError) {
        const errorMessage = loginErr.status === 400 
          ? 'Requisição inválida' 
          : loginErr.status === 401 
            ? 'Credenciais Inválidas' 
            : message

        message = `[${loginErr.status}] ${errorMessage}`
      }

      toast(message, SONNER_ERROR_STYLE)
      console.log(loginErr)
    }
  }

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
          <div className="flex flex-col gap-4 px-6">
            <Input
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email"
            />
            <Input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Senha"
            />
          </div>
          <div className="flex flex-col gap-2 w-full px-24">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="flex-1 hover:bg-orange-300 bg-orange-200"
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
