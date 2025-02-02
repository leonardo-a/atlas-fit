import { WorkoutPlanExerciseWithName } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-exercise-with-name'

export class WorkoutPlanExerciseWithNamePresenter {
  static toHTTP(workoutPlanExerciseWithName: WorkoutPlanExerciseWithName) {
    return {
      id: workoutPlanExerciseWithName.workoutPlanExerciseId.toString(),
      exerciseId: workoutPlanExerciseWithName.exerciseId.toString(),
      name: workoutPlanExerciseWithName.name,
      repetitions: workoutPlanExerciseWithName.repetitions,
      sets: workoutPlanExerciseWithName.sets,
    }
  }
}
