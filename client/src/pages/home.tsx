import { ClipboardList, CloudAlert, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Header } from '@/components/header'
import { NewWorkoutPlanSheet } from '@/components/new-workout-plan-sheet'
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
      <div className="mt-16 flex flex-col justify-end gap-4 h-44 p-4 bg-linear-to-tr from-orange-200 to-orange-100 rounded-lg mx-4">
        <div className="leading-tight">
          <h2 className="font-semibold text-md text-slate-950">Bem vindo, {user?.name}!</h2>
          <p className="text-md text-slate-800">
            {
              user?.role === 'PERSONAL_TRAINER'
                ? 'Acompanhe os treinos dos seus alunos'
                : 'Confira sua rotina de treino da semana'
            }
          </p>
        </div>
        <WeekCarousel size="sm" />
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
            <div className="flex w-full items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <ClipboardList size={20} />
                <p className="text-md my-4 leading-none">
                  {
                    user?.role === 'PERSONAL_TRAINER'
                      ? 'Planilhas'
                      : 'Meus Treinos'
                    }
                </p>
              </div>
              {user?.role === 'PERSONAL_TRAINER' && (<NewWorkoutPlanSheet />)}
            </div>
            <Input placeholder="Busque por planilhas..." />
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
