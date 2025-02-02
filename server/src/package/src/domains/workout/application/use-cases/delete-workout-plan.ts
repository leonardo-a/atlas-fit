import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'
import { Injectable } from '@nestjs/common'

interface DeleteWorkoutPlanUseCaseRequest {
  authorId: string
  workoutPlanId: string
}

type DeleteWorkoutPlanUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

@Injectable()
export class DeleteWorkoutPlanUseCase {
  constructor(private workoutPlansRepository: WorkoutPlansRepository) {}

  async execute({
    authorId,
    workoutPlanId,
  }: DeleteWorkoutPlanUseCaseRequest): Promise<DeleteWorkoutPlanUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRepository.findById(workoutPlanId)

    if (!workoutPlan) {
      return left(new ResourceNotFoundError())
    }

    if (workoutPlan?.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.workoutPlansRepository.delete(workoutPlan)

    return right(null)
  }
}
