import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlan } from '../../enterprise/entities/workout-plan'
import { WorkoutPlanExerciseList } from '../../enterprise/entities/workout-plan-exercise-list'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'

interface CreateWorkoutPlanUseCaseRequest {
  ownerId: string
  title: string
}

type CreateWorkoutPlanUseCaseResponse = Either<
  null,
  {
    workoutPlan: WorkoutPlan
  }
>

export class CreateWorkoutPlanUseCase {
  constructor(private workoutPlansRepository: WorkoutPlansRepository) {}

  async execute({
    ownerId,
    title,
  }: CreateWorkoutPlanUseCaseRequest): Promise<CreateWorkoutPlanUseCaseResponse> {
    const workoutPlan = WorkoutPlan.create({
      ownerId: new UniqueEntityID(ownerId),
      title,
      exercises: new WorkoutPlanExerciseList([]),
    })

    await this.workoutPlansRepository.create(workoutPlan)

    return right({
      workoutPlan,
    })
  }
}
