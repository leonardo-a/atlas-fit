import { WorkoutPlansRepository } from '@/domain/workout/application/repositories/workout-plans-repository'
import { WorkoutPlan } from '@/domain/workout/enterprise/entities/workout-plan'

export class InMemoryWorkoutPlansRepository implements WorkoutPlansRepository {
  public items: WorkoutPlan[] = []

  async findById(id: string): Promise<WorkoutPlan | null> {
    const workoutPlan = this.items.find((item) => item.id.toString() === id)

    if (!workoutPlan) {
      return null
    }

    return workoutPlan
  }

  async create(workoutPlan: WorkoutPlan): Promise<void> {
    this.items.push(workoutPlan)
  }

  async save(workoutPlan: WorkoutPlan): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === workoutPlan.id,
    )

    this.items[questionIndex] = workoutPlan
  }

  async delete(workoutPlan: WorkoutPlan): Promise<void> {
    const workoutPlanIndex = this.items.findIndex(
      (item) => item.id === workoutPlan.id,
    )

    // this.workoutPlanExercisesRepository.deleteManyByWorkoutPlanId(
    //   workoutPlan.id.toString(),
    // )

    this.items.splice(workoutPlanIndex, 1)
  }
}
