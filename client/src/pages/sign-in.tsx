import { Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router";


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



    } catch(loginErr) {
      console.log(loginErr)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="w-full h-16 grid place-items-center bg-slate-100 fixed">
        <Dumbbell size={36} className="text-lime-400"/>
      </div>
      <div className="grid place-items-center gap-4 h-dvh p-4 bg-orange-100">
        <div className="bg-slate-100 shadow-md max-w-lg w-full rounded-md p-4 space-y-6">
          <h2 className="place-self-center text-xl font-bold">Entrar</h2>
          <div className="flex flex-col gap-4">
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
              variant={'outline'} 
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