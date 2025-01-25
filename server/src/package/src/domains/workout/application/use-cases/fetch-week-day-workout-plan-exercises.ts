import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlanExerciseWithName } from '../../enterprise/entities/value-objects/workout-plan-exercise-with-name'
import { WorkoutPlanExercisesRepository } from '../repositories/workout-plan-exercises-repository'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'

interface FetchWeekDayWorkoutPlanExercisesUseCaseRequest {
  userId: string
  weekDay: number
  workoutPlanId: string
}

type FetchWeekDayWorkoutPlanExercisesUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { weekDayExercises: WorkoutPlanExerciseWithName[] }
>

@Injectable()
export class FetchWeekDayWorkoutPlanExercisesUseCase {
  constructor(
    private workoutPlansRepository: WorkoutPlansRepository,
    private workoutPlanExercisesRepository: WorkoutPlanExercisesRepository,
  ) {}

  async execute({
    userId,
    weekDay,
    workoutPlanId,
  }: FetchWeekDayWorkoutPlanExercisesUseCaseRequest): Promise<FetchWeekDayWorkoutPlanExercisesUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRepository.findById(workoutPlanId)

    if (!workoutPlan) {
      return left(new ResourceNotFoundError())
    }

    if (
      workoutPlan.studentId.toString() !== userId &&
      workoutPlan.authorId.toString() !== userId
    ) {
      return left(new NotAllowedError())
    }

    const weekDayExercises =
      await this.workoutPlanExercisesRepository.findManyByWorkoutPlanWeekDay(
        workoutPlanId,
        weekDay,
      )

    return right({
      weekDayExercises,
    })
  }
}
