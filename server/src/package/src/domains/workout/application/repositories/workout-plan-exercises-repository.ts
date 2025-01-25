import { WorkoutPlanExerciseWithName } from '../../enterprise/entities/value-objects/workout-plan-exercise-with-name'
import { WorkoutPlanExercise } from '../../enterprise/entities/workout-plan-exercise'

export abstract class WorkoutPlanExercisesRepository {
  abstract findById(id: string): Promise<WorkoutPlanExercise | null>

  abstract findManyByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutPlanExercise[]>

  abstract findManyByWorkoutPlanWeekDay(
    workoutPlanId: string,
    weekDay: number,
  ): Promise<WorkoutPlanExerciseWithName[]>

  abstract create(workoutPlanExercise: WorkoutPlanExercise): Promise<void>

  abstract createMany(
    workoutPlanExercises: WorkoutPlanExercise[],
  ): Promise<void>

  abstract delete(workoutPlanExercise: WorkoutPlanExercise): Promise<void>

  abstract deleteManyByWorkoutPlanId(workoutPlanId: string): Promise<void>
}
