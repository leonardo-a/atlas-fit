import { WorkoutPlanExercise } from '../../enterprise/entities/workout-plan-exercise'

export abstract class WorkoutPlanExercisesRepository {
  abstract findById(id: string): Promise<WorkoutPlanExercise | null>

  abstract findManyByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutPlanExercise[]>

  abstract create(workoutPlanExercise: WorkoutPlanExercise): Promise<void>

  abstract delete(workoutPlanExercise: WorkoutPlanExercise): Promise<void>

  abstract deleteManyByWorkoutPlanId(workoutPlanId: string): Promise<void>
}
