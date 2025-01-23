// assign-exercise-to-workout-plan.ts
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlanExercise } from '../../enterprise/entities/workout-plan-exercise'
import { WorkoutPlanExerciseList } from '../../enterprise/entities/workout-plan-exercise-list'
import { WorkoutPlanExercisesRepository } from '../repositories/workout-plan-exercises-repository'
import { InvalidWeekDayError } from './errors/invalid-week-day-error'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WorkoutPlanExerciseAlreadyExistsOnWeekDayError } from './errors/workout-plan-exercise-already-exists-on-week-day-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ExerciseLimitReachedError } from './errors/exercise-limit-reached-error'

interface AssignExerciseToWorkoutPlanUseCaseRequest {
  ownerId: string
  exerciseId: string
  workoutPlanId: string
  repetitions: number
  sets: number
  weekDay: number
}

type AssignExerciseToWorkoutPlanUseCaseResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | InvalidWeekDayError
  | ExerciseLimitReachedError
  | WorkoutPlanExerciseAlreadyExistsOnWeekDayError,
  {
    workoutPlanExercise: WorkoutPlanExercise
  }
>

@Injectable()
export class AssignExerciseToWorkoutPlanUseCase {
  constructor(
    private workoutPlanExercisesRepository: WorkoutPlanExercisesRepository,
    private workoutPlansRepository: WorkoutPlansRepository,
    private exercisesRepository: ExercisesRepository,
  ) {}

  async execute({
    ownerId,
    exerciseId,
    workoutPlanId,
    repetitions,
    sets,
    weekDay,
  }: AssignExerciseToWorkoutPlanUseCaseRequest): Promise<AssignExerciseToWorkoutPlanUseCaseResponse> {
    if (weekDay < 1 && weekDay > 7) {
      return left(new InvalidWeekDayError())
    }

    const exercise = await this.exercisesRepository.findById(exerciseId)

    if (!exercise) {
      return left(new ResourceNotFoundError())
    }

    const workoutPlan =
      await this.workoutPlansRepository.findById(workoutPlanId)

    if (!workoutPlan) {
      return left(new ResourceNotFoundError())
    }

    if (workoutPlan.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    const workoutPlanExercise = WorkoutPlanExercise.create({
      exerciseId: new UniqueEntityID(exerciseId),
      repetitions,
      sets,
      weekDay,
      workoutPlanId: new UniqueEntityID(workoutPlanId),
    })

    const currentWorkoutPlanExercises =
      await this.workoutPlanExercisesRepository.findManyByWorkoutPlanId(
        workoutPlanId,
      )

    if (currentWorkoutPlanExercises.length >= 40) {
      return left(new ExerciseLimitReachedError())
    }

    const workoutPlanExerciseList = new WorkoutPlanExerciseList(
      currentWorkoutPlanExercises,
    )

    workoutPlanExerciseList.add(workoutPlanExercise)

    const newWorkoutPlanExercises = workoutPlanExerciseList.getNewItems()

    if (newWorkoutPlanExercises.length === 0) {
      return left(new WorkoutPlanExerciseAlreadyExistsOnWeekDayError())
    }

    await this.workoutPlanExercisesRepository.createMany(
      newWorkoutPlanExercises,
    )

    return right({
      workoutPlanExercise,
    })
  }
}
