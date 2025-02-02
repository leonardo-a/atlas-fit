export interface WorkoutPlanExerciseWithName {
  workoutPlanExerciseId: string
  exerciseId: string
  name: string
  sets: number
  repetitions: number
}

export interface Exercise {
  id: string
  name: string
  videoUrl?: string
  description?: string
}
