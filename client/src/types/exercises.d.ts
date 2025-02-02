export interface WorkoutPlanExerciseWithDetails {
  workoutPlanExerciseId: string
  exerciseId: string
  name: string
  sets: number
  repetitions: number
  videoUrl?: string
}

export interface Exercise {
  id: string
  name: string
  videoUrl?: string
  description?: string
}
