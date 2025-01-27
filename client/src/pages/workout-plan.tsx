import { BedDouble, CloudAlert, Dumbbell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { WeekCarousel } from "@/components/week-caroussel";
import { WorkoutPlanExercise } from "@/components/workout-plan-exercise";
import { api } from "@/lib/axios";
import { WorkoutPlanExerciseWithName } from "@/types/exercises";
import { WorkoutPlanWithDetails } from "@/types/workout-plan";
import { RequestStatus } from "@/types/app";


export function WorkoutPlan() {
  const { id } = useParams()

  const [status, setStatus] = useState<RequestStatus>('pending')
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanWithDetails | null>(null)
  const [exercises, setExercises] = useState<WorkoutPlanExerciseWithName[]>([])
  const [weekDay, setWeekDay] = useState<number>(new Date().getDay() + 1)

  async function fetchWorkoutPlan() {
    setStatus('pending')

    try {
      const response = await api.get(`/workout-plans/${id}`)

      setWorkoutPlan(response.data.workoutPlan)
      setStatus('success')

      fetchExercises()
    } catch(err) {
      setStatus('failed')
      console.log(err)
    }
  }

  async function fetchExercises() {
    try {
      const response = await api.get(`/workout-plans/${id}/exercises`, {
        params: {
          weekDay,
        }
      })

      setExercises(response.data.weekDayExercises)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [weekDay])

  useEffect(() => {
    fetchWorkoutPlan()
  }, [id])

  return (
    <>
      <div className="w-full h-16 grid place-items-center bg-slate-100 fixed">
        <Dumbbell size={36} className="text-lime-400"/>
      </div>
      <main className="mt-16 flex-1 flex flex-col items-center bg-orange-100 p-4">
        {/* {workoutPlan} */}
        {status === 'pending' && (
          <div className="flex-1 grid place-items-center">
            <Loader2 className="animate-spin text-lime-400" size={32} />
          </div>
        )}
        {status === 'success' && workoutPlan !== null && (
          <div className="w-full flex-1 flex flex-col gap-6">
            <div className="flex flex-col justify-center items-center">
              <p className="text-sm font-medium text-slate-500 leading-none">Planilha</p>
              <h2 className="text-2xl font-bold text-slate-900 leading-none">{workoutPlan.title}</h2>
            </div>
            <WeekCarousel onWeekDayPress={setWeekDay} />
            <div className="w-full bg-slate-50 flex-1 flex flex-col rounded-md space-y-3 px-2 py-4 shadow-xs">
              <div className="flex flex-col flex-1 gap-3 w-full px-4">
                {exercises.length ? (
                  exercises.map((item) => (
                    <WorkoutPlanExercise 
                      key={item.workoutPlanExerciseId} 
                      {...item} 
                    />
                  ))
                ) : (
                  <div className="place-self-center my-auto flex flex-col items-center">
                    <BedDouble className="text-slate-500"/>
                    <div className="leading-tight text-center text-slate-500">
                      <span>Dia de descanso</span>
                      <p>Faça algo para relaxar!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {(status === 'failed' || !workoutPlan) && (
          <div className="flex-1 grid place-items-center">
            <div className="flex flex-col items-center">
              <CloudAlert className="text-lime-500" size={32} />
              <p className="text-lime-500">Houve um erro ao consultar a planilha.</p>
            </div>
          </div>
        )}
      </main>
    </>
  )
}