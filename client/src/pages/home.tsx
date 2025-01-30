import { ClipboardList, CloudAlert, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Header } from '@/components/header'
import { NewWorkoutPlanDrawer } from '@/components/new-workout-plan-drawer'
import { Input } from '@/components/ui/input'
import { WeekCarousel } from '@/components/week-caroussel'
import { WorkoutPlanItem } from '@/components/workout-plan-item'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/axios'
import { RequestStatus } from '@/types/app'
import { WorkoutPlanSummary } from '@/types/workout-plan'

export function Home() {
  const { user } = useAuth()
  const [workoutPlansStatus, setWorkoutPlansStatus] = useState<RequestStatus>('pending')
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanSummary[]>([])

  async function fetchWorkoutPlans() {
    setWorkoutPlansStatus('pending')

    try {
      const workoutPlans = await api.get('/workout-plans')

      setWorkoutPlans(workoutPlans.data.workoutPlans)
      setWorkoutPlansStatus('success')
    } catch (err) {
      setWorkoutPlansStatus('failed')
      console.log(err)
    }
  }

  useEffect(() => {
    fetchWorkoutPlans()
  }, [])

  return (
    <>
      <Header />
      <div className="mt-16 flex flex-col justify-end gap-4 h-44 p-4 bg-linear-to-tr from-orange-200 to-orange-100">
        <div className="leading-tight">
          {
            user?.role === 'PERSONAL_TRAINER' && (
              <>
                <h2 className="font-semibold text-md text-slate-950">Bem vindo, Professor!</h2>
                <p className="text-md text-slate-800">Acompanhe os treinos dos seus alunos</p>
              </>
            )
          }
          {
            user?.role === 'STUDENT' && (
              <>
                <h2 className="font-semibold text-md text-slate-950">Bem vindo, Usuário!</h2>
                <p className="text-md text-slate-800">Confira sua rotina de treino da semana</p>
              </>
            )
          }
        </div>
        <WeekCarousel />
      </div>
      <main className="flex flex-col gap-4 flex-1 items-center bg-slate-100 px-5">
        {workoutPlansStatus === 'pending' && (
          <div className="my-auto">
            <Loader2 className="animate-spin text-lime-400" size={32} />
          </div>
        )}
        {workoutPlansStatus === 'failed' && (
          <div className="my-auto">
            <div className="flex flex-col items-center">
              <CloudAlert className="text-red-400" />
              <span className="text-red-400">Erro ao buscar planilhas</span>
            </div>
          </div>
        )}
        {(workoutPlansStatus === 'success' && workoutPlans) && (
          <>
            {
              user?.role === 'PERSONAL_TRAINER' && (
                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center gap-1">
                    <ClipboardList />
                    <p className="text-xl font-bold my-4">Planilhas</p>
                  </div>
                  <NewWorkoutPlanDrawer />
                </div>
              )
            }
            {
              user?.role === 'STUDENT' && (
                <p className="text-2xl font-bold my-2">Minhas Planilhas</p>
              )
            }
            <Input placeholder="Nome da planilha..." />
            <div className="w-full flex flex-col gap-4">
              {workoutPlans.map((item) => (
                <WorkoutPlanItem key={item.slug} {...item} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}
