import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlanExercisesRepository } from '../repositories/workout-plan-exercises-repository'

interface RemoveExerciseFromWorkoutPlanUseCaseRequest {
  workoutPlanExerciseId: string
}

type RemoveExerciseFromWorkoutPlanUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export class RemoveExerciseFromWorkoutPlanUseCase {
  constructor(
    private workoutPlanExercisesRepostiory: WorkoutPlanExercisesRepository,
  ) {}

  async execute({
    workoutPlanExerciseId,
  }: RemoveExerciseFromWorkoutPlanUseCaseRequest): Promise<RemoveExerciseFromWorkoutPlanUseCaseResponse> {
    const workoutPlanExercise =
      await this.workoutPlanExercisesRepostiory.findById(workoutPlanExerciseId)

    if (!workoutPlanExercise) {
      return left(new ResourceNotFoundError())
    }

    await this.workoutPlanExercisesRepostiory.delete(workoutPlanExercise)

    return right(null)
  }
}
