import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlan } from '../../enterprise/entities/workout-plan'
import { WorkoutPlanExerciseList } from '../../enterprise/entities/workout-plan-exercise-list'
import { PersonalTrainersRepository } from '../repositories/personal-trainers-repository'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'
import { WorkoutPlanAlreadyExistsError } from './errors/workout-plan-already-exists-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface CreateWorkoutPlanUseCaseRequest {
  authorId: string
  studentId: string
  title: string
  description?: string
}

type CreateWorkoutPlanUseCaseResponse = Either<
  WorkoutPlanAlreadyExistsError | NotAllowedError,
  {
    workoutPlan: WorkoutPlan
  }
>

@Injectable()
export class CreateWorkoutPlanUseCase {
  constructor(
    private personalTrainersRepository: PersonalTrainersRepository,
    private workoutPlansRepository: WorkoutPlansRepository,
  ) {}

  async execute({
    authorId,
    studentId,
    title,
    description,
  }: CreateWorkoutPlanUseCaseRequest): Promise<CreateWorkoutPlanUseCaseResponse> {
    const personalTrainer =
      await this.personalTrainersRepository.findById(authorId)

    if (!personalTrainer) {
      return left(new NotAllowedError())
    }

    const workoutPlan = WorkoutPlan.create({
      authorId: new UniqueEntityID(authorId),
      studentId: new UniqueEntityID(studentId),
      title,
      exercises: new WorkoutPlanExerciseList([]),
      description,
    })

    const workoutPlanWithSameSlug =
      await this.workoutPlansRepository.findBySlug(workoutPlan.slug.value)

    if (workoutPlanWithSameSlug) {
      return left(
        new WorkoutPlanAlreadyExistsError(workoutPlanWithSameSlug.slug.value),
      )
    }

    await this.workoutPlansRepository.create(workoutPlan)

    return right({
      workoutPlan,
    })
  }
}
