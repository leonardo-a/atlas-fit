import { PlayCircle } from 'lucide-react'
import { useState } from 'react'

import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { WorkoutPlanExerciseWithDetails } from '@/types/exercises'
import { ExerciseVideoDialog } from './exercise-video-dialog'
import { RemoveWorkoutPlanExerciseDialog } from './remove-workout-plan-exercise-dialog'
import { Button } from './ui/button'

interface WorkoutPlanExerciseProps extends WorkoutPlanExerciseWithDetails {
  sequence: number
}

export function WorkoutPlanExercise({
  id,
  name,
  repetitions,
  sets,
  videoUrl,
  sequence,
}: WorkoutPlanExerciseProps) {
  const { user } = useAuth()
  const [isActionsOpen, setIsActionsOpen] = useState(false)

  return (
    <div
      key={`workout-plan-exercise-${id}`}
      className={cn(
        'bg-slate-200 dark:bg-slate-800 rounded-md transition-all ',
        isActionsOpen
          ? 'max-h-56'
          : 'max-h-20',
      )}
    >
      <div className="w-full h-20 bg-slate-50 dark:bg-slate-900 p-1 rounded-md shadow-xs">
        <div className="flex items-center gap-3 h-full px-1 py-2 rounded-md">
          <div className="size-6 bg-slate-200 dark:bg-slate-800 rounded-full grid place-items-center">
            <span className="text-xs text-slate-500 font-semibold">{sequence}</span>
          </div>
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="flex flex-col justify-between h-full flex-1"
          >
            <div className="leading-tight text-left">
              <p className="font-bold text-slate-800 dark:text-slate-300">{name}</p>
              <p className="font-bold text-slate-800 dark:text-slate-500">{}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{sets}</span>
                <span
                  className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-400 text-sm px-2 rounded-md"
                >
                  sets
                </span>
              </div>
              <div className="w-[1.5px] h-full bg-slate-300 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{repetitions}</span>
                <span
                  className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-400 text-sm px-2 rounded-md"
                >
                  reps
                </span>
              </div>
            </div>
          </button>
          <div>
            {videoUrl
              ? (
                <ExerciseVideoDialog name={name} videoUrl={videoUrl} />
                )
              : (
                <Button disabled size="icon" className="bg-slate-400">
                  <PlayCircle />
                </Button>
                )}
          </div>
        </div>
      </div>

      {user?.role !== 'STUDENT' && (
        <div
          className={cn(
            'p-2 overflow-hidden transition-all flex items-center justify-end',
            isActionsOpen
              ? 'opacity-100 scale-y-100'
              : 'opacity-0 scale-y-0',
          )}
        >
          <RemoveWorkoutPlanExerciseDialog
            exercise={name}
            workoutPlanExerciseId={id}
            onSuccess={() => setIsActionsOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
