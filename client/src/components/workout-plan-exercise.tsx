import { Dumbbell, PlayCircle } from 'lucide-react'
import { WorkoutPlanExerciseWithDetails } from '@/types/exercises'
import { ExerciseVideoDialog } from './exercise-video-dialog'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/auth-context'
import { RemoveWorkoutPlanExerciseDialog } from './remove-workout-plan-exercise-dialog'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type WorkoutPlanExerciseProps = WorkoutPlanExerciseWithDetails

export function WorkoutPlanExercise({ id, name, repetitions, sets, videoUrl }: WorkoutPlanExerciseProps) {
  const { user } = useAuth()
  const [isActionsOpen, setIsActionsOpen] = useState(false)

  return (
    <div
      key={`workout-plan-exercise-${id}`}
      className={cn(
        'bg-slate-200 rounded-md transition-all ',
        isActionsOpen
          ? 'max-h-40'
          : 'max-h-16',
      )}
    >
      <div className="w-full h-16 bg-slate-50 px-2 py-3 rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex">
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
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="flex items-center h-full justify-between flex-1"
          >
            <div>
              <p className="font-bold text-slate-800">{name}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Dumbbell size={20} className="text-lime-500" />
                <span className="text-slate-500">{sets}x{repetitions}</span>
              </div>
            </div>
          </button>
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
