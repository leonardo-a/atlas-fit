import { CloudAlert, Dumbbell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { WeekCarousel } from "@/components/week-caroussel";
import { WorkoutPlanItem } from "@/components/workout-plan-item";
import { api } from "@/lib/axios";
import { RequestStatus } from "@/types/app";
import { WorkoutPlanSummary } from "@/types/workout-plan";


export function Home() {
  const [workoutPlansStatus, setWorkoutPlansStatus] = useState<RequestStatus>('pending')
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanSummary[]>([])

  async function fetchWorkoutPlans() {
    setWorkoutPlansStatus('pending')

    try {
      const workoutPlans = await api.get('/workout-plans')

      setWorkoutPlans(workoutPlans.data.workoutPlans)
      setWorkoutPlansStatus('success')
    } catch(err) {
      setWorkoutPlansStatus('failed')
      console.log(err)
    }
  }

  useEffect(() => {
    fetchWorkoutPlans()
  }, [])

  return (
    <>
      <div className="w-full h-16 grid place-items-center bg-slate-100 fixed">
        <Dumbbell size={36} className="text-lime-400"/>
      </div>
      <div className="mt-16 flex flex-col justify-end gap-4 h-44 p-4 bg-orange-100">
        <div className="leading-tight">
        <h2 className="font-semibold text-md text-slate-950">Bem vindo, Usuário!</h2>
        <p className="text-md text-slate-800">Confira sua rotina de treino da semana</p>
        </div>
        <WeekCarousel />
      </div>
      <main className="flex flex-col flex-1 items-center bg-slate-100">
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
        {(workoutPlansStatus === 'success' && workoutPlans) &&  (
          <>
            <p className="text-2xl font-bold my-6">Minhas Planilhas</p>
            <div className="w-full flex flex-col gap-4 px-4">
              {workoutPlans.map((item) =>  (
              <WorkoutPlanItem key={item.slug} {...item} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}