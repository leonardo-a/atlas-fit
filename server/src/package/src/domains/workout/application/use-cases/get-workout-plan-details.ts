import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlanWithDetails } from '../../enterprise/entities/value-objects/workout-plan-with-details'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'

interface GetWorkoutPlanDetailsUseCaseRequest {
  slug: string
  userId: string
}

type GetWorkoutPlanDetailsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { workoutPlan: WorkoutPlanWithDetails }
>

@Injectable()
export class GetWorkoutPlanDetailsUseCase {
  constructor(private workoutPlansRepository: WorkoutPlansRepository) {}

  async execute({
    slug,
    userId,
  }: GetWorkoutPlanDetailsUseCaseRequest): Promise<GetWorkoutPlanDetailsUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRepository.findBySlugWithDetails(slug)

    if (!workoutPlan) {
      return left(new ResourceNotFoundError())
    }

    if (
      workoutPlan.authorId.toString() !== userId &&
      workoutPlan.studentId.toString() !== userId
    ) {
      return left(new NotAllowedError())
    }

    return right({
      workoutPlan,
    })
  }
}
