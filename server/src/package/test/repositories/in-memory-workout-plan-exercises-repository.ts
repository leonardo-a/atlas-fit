import { WorkoutPlanExercisesRepository } from '@/domain/workout/application/repositories/workout-plan-exercises-repository'
import { WorkoutPlanExercise } from '@/domain/workout/enterprise/entities/workout-plan-exercise'

export class InMemoryWorkoutPlanExercisesRepository
  implements WorkoutPlanExercisesRepository
{
  public items: WorkoutPlanExercise[] = []

  async findById(id: string): Promise<WorkoutPlanExercise | null> {
    const workoutPlanExercise = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!workoutPlanExercise) {
      return null
    }

    return workoutPlanExercise
  }

  async findManyByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutPlanExercise[]> {
    const workoutPlanExercises = this.items.filter(
      (item) => item.workoutPlanId.toString() === workoutPlanId,
    )

    return workoutPlanExercises
  }

  async create(workoutPlanExercise: WorkoutPlanExercise): Promise<void> {
    this.items.push(workoutPlanExercise)
  }

  async createMany(workoutPlanExercises: WorkoutPlanExercise[]): Promise<void> {
    this.items.push(...workoutPlanExercises)
  }

  async delete(workoutPlanExercise: WorkoutPlanExercise): Promise<void> {
    const workoutPlanExerciseIndex = this.items.findIndex(
      (item) => item.id === workoutPlanExercise.id,
    )

    this.items.splice(workoutPlanExerciseIndex, 1)
  }

  async deleteManyByWorkoutPlanId(workoutPlanId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.workoutPlanId.toString() !== workoutPlanId,
    )
  }
}
