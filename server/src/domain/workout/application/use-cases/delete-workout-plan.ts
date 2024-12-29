import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'

interface DeleteWorkoutPlanUseCaseRequest {
  ownerId: string
  workoutPlanId: string
}

type DeleteWorkoutPlanUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

export class DeleteWorkoutPlanUseCase {
  constructor(private workoutPlansRepository: WorkoutPlansRepository) {}

  async execute({
    ownerId,
    workoutPlanId,
  }: DeleteWorkoutPlanUseCaseRequest): Promise<DeleteWorkoutPlanUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRepository.findById(workoutPlanId)

    if (!workoutPlan) {
      return left(new ResourceNotFoundError())
    }

    if (workoutPlan?.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    await this.workoutPlansRepository.delete(workoutPlan)

    return right(null)
  }
}
