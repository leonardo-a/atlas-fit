import { WorkoutPlansRepository } from '@/domains/workout/application/repositories/workout-plans-repository'
import { WorkoutPlan } from '@/domains/workout/enterprise/entities/workout-plan'
import { InMemoryWorkoutPlanExercisesRepository } from './in-memory-workout-plan-exercises-repository'

export class InMemoryWorkoutPlansRepository implements WorkoutPlansRepository {
  public items: WorkoutPlan[] = []

  constructor(
    private workoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository,
  ) {}

  async findById(id: string): Promise<WorkoutPlan | null> {
    const workoutPlan = this.items.find((item) => item.id.toString() === id)

    if (!workoutPlan) {
      return null
    }

    return workoutPlan
  }

  async create(workoutPlan: WorkoutPlan): Promise<void> {
    this.items.push(workoutPlan)

    await this.workoutPlanExercisesRepository.createMany(
      workoutPlan.exercises.getItems(),
    )
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

    this.workoutPlanExercisesRepository.deleteManyByWorkoutPlanId(
      workoutPlan.id.toString(),
    )

    this.items.splice(workoutPlanIndex, 1)
  }
}
