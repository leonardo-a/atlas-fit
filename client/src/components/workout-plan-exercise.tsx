import { Dumbbell, PlayCircle } from 'lucide-react'

import { WorkoutPlanExerciseWithDetails } from '@/types/exercises'
import { ExerciseVideoDialog } from './exercise-video-dialog'
import { Button } from './ui/button'

type WorkoutPlanExerciseProps = WorkoutPlanExerciseWithDetails

export function WorkoutPlanExercise({ name, repetitions, sets, videoUrl }: WorkoutPlanExerciseProps) {
  return (
    <div
      className="w-full bg-slate-50 px-2 py-3 rounded-md shadow-sm"
    >
      <div className="flex justify-between">
        <div className="flex gap-2">
          {
            videoUrl
              ? (<ExerciseVideoDialog name={name} videoUrl={videoUrl} />)
              : (
                <Button disabled size="icon" className="bg-slate-400">
                  <PlayCircle />
                </Button>
                )
          }
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
