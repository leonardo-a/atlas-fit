import { Dumbbell } from "lucide-react"

import { WorkoutPlanExerciseWithName } from "@/types/exercises"

type WorkoutPlanExerciseProps = WorkoutPlanExerciseWithName

export function WorkoutPlanExercise({ name, repetitions, sets }: WorkoutPlanExerciseProps) {
  return (
    <div
      className="w-full bg-slate-50 px-2 py-3 rounded-md shadow-sm"
    >
      <div className="flex justify-between">
        <div>
          <span className="text lg font-bold text-slate-800">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell size={20} className="text-lime-500" />
          <span className="text-slate-500">{sets}x{repetitions}</span>
        </div>
      </div>
    </div>
  )
}
