import { BookCopy, ClipboardList, CloudAlert, Dumbbell, Loader2, Users2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import Dumbbells from '../assets/dumbells-2.jpg'
import Exercise from '../assets/exercise.jpg'
import Students from '../assets/students.jpg'
import WorkoutPlan from '../assets/workout-plan.jpg'

import { Header } from '@/components/header'
import { PersonalTrainerOption } from '@/components/personal-trainer-options'
import { SecondaryContainer } from '@/components/secondary-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WeekCarousel } from '@/components/week-caroussel'
import { WorkoutPlanItem } from '@/components/workout-plan-item'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/axios'
import { RequestStatus } from '@/types/app'
import { WorkoutPlanSummary } from '@/types/workout-plan'

export function Home() {
  const { user } = useAuth()
  const [workoutPlansStatus, setWorkoutPlansStatus] = useState<RequestStatus>('idle')
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
    if (user?.role === 'STUDENT') {
      fetchWorkoutPlans()
    }
  }, [user])

  return (
    <>
      <Header />
      <SecondaryContainer
        bannerUrl={Dumbbells}
        className="mt-16 flex flex-col justify-end items-start gap-12 h-56 lg:h-96"
      >
        <div className="leading-tight bg-slate-950/30 lg:bg-transparent p-2 rounded-lg">
          <h2 className="font-semibold text-md lg:text-2xl text-lime-300">Bem vindo, {user?.shortName}!</h2>
          <p className="text-md lg:text-lg text-lime-200">
            {
              user?.role === 'PERSONAL_TRAINER'
                ? 'Acompanhe os treinos dos seus alunos'
                : 'Confira sua rotina de treino da semana'
            }
          </p>
        </div>
        <div className="max-w-xl w-full">
          <WeekCarousel size="sm" />
        </div>
      </SecondaryContainer>
      <main className="flex flex-col gap-4 flex-1 items-center px-5">
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
          <div className="mt-4 w-full">
            {user?.role === 'STUDENT' && (
              <div className="space-y-3">
                <Input placeholder="Busque por planilhas..." />
                <div className="w-full flex flex-col gap-4">
                  {workoutPlans.map((item) => (
                    <WorkoutPlanItem key={item.slug} {...item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {(user?.role === 'PERSONAL_TRAINER' || user?.role === 'ADMIN') && (
          <div className="w-full">
            <div className="grid grid-cols-1 w-full gap-4 my-8">
              <PersonalTrainerOption
                to="/planilhas"
                title="Minhas Planilhas"
                description="Consulte as planilhas de seus alunos"
                icon={ClipboardList}
                bannerUrl={WorkoutPlan}
              />
              <PersonalTrainerOption
                to="/exercicios"
                title="Exercícios"
                description="Gerencie os exercícios cadastrados"
                icon={Dumbbell}
                bannerUrl={Exercise}
              />
              <PersonalTrainerOption
                to="/alunos"
                title="Alunos"
                description="Procure por alunos cadastrados"
                icon={Users2}
                bannerUrl={Students}
              />
              <Button variant="outline" className="h-32 [&_svg]:size-8" disabled>
                <div className="flex w-full items-center justify-start gap-2">
                  <div className="size-12 grid place-items-center">
                    <BookCopy strokeWidth={1} />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-lg">
                      Lista de exercícios{' '}
                      <span className="font-light text-sky-400 text-xs italic">em breve</span>
                    </p>
                    <p className="text-xs opacity-70">
                      Gerencie suas listas prontas de exercícios
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
