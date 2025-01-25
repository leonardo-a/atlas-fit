import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlanExercisesRepository } from '../repositories/workout-plan-exercises-repository'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { PersonalTrainersRepository } from '../repositories/personal-trainers-repository'

interface RemoveExerciseFromWorkoutPlanUseCaseRequest {
  authorId: string
  workoutPlanExerciseId: string
}

type RemoveExerciseFromWorkoutPlanUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class RemoveExerciseFromWorkoutPlanUseCase {
  constructor(
    private personalTrainersRepository: PersonalTrainersRepository,
    private workoutPlanExercisesRepostiory: WorkoutPlanExercisesRepository,
    private workoutPlansRepository: WorkoutPlansRepository,
  ) {}

  async execute({
    workoutPlanExerciseId,
    authorId,
  }: RemoveExerciseFromWorkoutPlanUseCaseRequest): Promise<RemoveExerciseFromWorkoutPlanUseCaseResponse> {
    const author = await this.personalTrainersRepository.findById(authorId)

    if (!author) {
      return left(new NotAllowedError())
    }

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

    await this.workoutPlanExercisesRepostiory.delete(workoutPlanExercise)

    return right(null)
  }
}
