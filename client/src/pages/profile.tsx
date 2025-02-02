import { Header } from '@/components/header'
import { NewExerciseSheet } from '@/components/new-exercise-sheet'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { Dumbbell, LogOut, User2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!user) {
    navigate('/entrar')
    return
  }

  return (
    <>
      <Header />
      <div className="w-full h-dvh bg-slate-50 flex flex-col items-center justify-between px-4">
        <div className="flex flex-col items-center gap-2 mt-24">
          <div className="size-[102px] grid place-items-center rounded-full bg-linear-to-bl from-lime-500 to-lime-300">
            <div className="size-24 rounded-full bg-slate-50 grid place-items-center">
              <User2 size={52} strokeWidth={1} className="text-slate-400" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="font-bold font-display text-xl">{user.name}</h2>
            <p className="leading-none text-sm font-semibold opacity-70">
              {user.role === 'PERSONAL_TRAINER' && 'Personal Trainer'}
              {user.role === 'STUDENT' && 'Aluno'}
              {user.role === 'ADMIN' && 'Admin'}
            </p>
          </div>
        </div>
        <div className="h-px rounded-full w-full bg-slate-200 my-5" />
        <div className="flex-1 space-y-6 w-full rounded-md">
          {
            user.role === 'ADMIN' && (
              <div className="flex flex-col gap-2">
                <span className="font-medium opacity-70">Admin</span>
                <div className="flex flex-col gap-3 px-3">
                  <Button variant="outline" className="justify-start">
                    <User2 /> Cadastrar personal
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <User2 /> Cadastrar aluno
                  </Button>
                </div>
              </div>
            )
          }
          {
            (user.role === 'ADMIN' || user.role === 'PERSONAL_TRAINER') && (
              <div className="flex flex-col gap-2">
                <span className="font-medium opacity-70">Treinos</span>
                <div className="flex flex-col gap-3 px-3">
                  <NewExerciseSheet>
                    <Button variant="outline" className="justify-start w-full">
                      <Dumbbell /> Cadastrar exercício
                    </Button>
                  </NewExerciseSheet>
                  {/* <Button variant="outline" className="justify-start">
                    <ListPlus /> Cadastrar lista de exercícios
                  </Button> */}
                </div>
              </div>
            )
          }
          <div className="flex flex-col gap-2">
            <span className="font-medium opacity-70">Minha conta</span>
            <div className="flex flex-col gap-3 px-3">
              {/* <Button variant="outline" className="justify-start">
                <UserCog2 /> Alterar senha
              </Button> */}
              <Button
                variant="outline"
                className="justify-start text-red-400 border border-red-400 hover:text-red-500"
                onClick={() => logout()}
              >
                <LogOut /> Sair
              </Button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
