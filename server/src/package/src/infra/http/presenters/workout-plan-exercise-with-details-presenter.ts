import { WorkoutPlanExerciseWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-exercise-with-details'

export class WorkoutPlanExerciseWithDetailsPresenter {
  static toHTTP(
    workoutPlanExerciseWithDetails: WorkoutPlanExerciseWithDetails,
  ) {
    return {
      id: workoutPlanExerciseWithDetails.workoutPlanExerciseId.toString(),
      exerciseId: workoutPlanExerciseWithDetails.exerciseId.toString(),
      name: workoutPlanExerciseWithDetails.name,
      repetitions: workoutPlanExerciseWithDetails.repetitions,
      sets: workoutPlanExerciseWithDetails.sets,
      videoUrl: workoutPlanExerciseWithDetails.videoUrl,
    }
  }
}
