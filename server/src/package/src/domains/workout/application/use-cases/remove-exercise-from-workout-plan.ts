import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlanExercisesRepository } from '../repositories/workout-plan-exercises-repository'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface RemoveExerciseFromWorkoutPlanUseCaseRequest {
  workoutPlanExerciseId: string
  ownerId: string
}

type RemoveExerciseFromWorkoutPlanUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class RemoveExerciseFromWorkoutPlanUseCase {
  constructor(
    private workoutPlanExercisesRepostiory: WorkoutPlanExercisesRepository,
    private workoutPlansRepository: WorkoutPlansRepository,
  ) {}

  async execute({
    workoutPlanExerciseId,
    ownerId,
  }: RemoveExerciseFromWorkoutPlanUseCaseRequest): Promise<RemoveExerciseFromWorkoutPlanUseCaseResponse> {
    const workoutPlanExercise =
      await this.workoutPlanExercisesRepostiory.findById(workoutPlanExerciseId)

    if (!workoutPlanExercise) {
      return left(new ResourceNotFoundError())
    }

    const workoutPlan = await this.workoutPlansRepository.findById(
      workoutPlanExercise.workoutPlanId.toString(),
    )

    if (!workoutPlan) {
      return left(new ResourceNotFoundError())
    }

    if (workoutPlan.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    await this.workoutPlanExercisesRepostiory.delete(workoutPlanExercise)

    return right(null)
  }
}
