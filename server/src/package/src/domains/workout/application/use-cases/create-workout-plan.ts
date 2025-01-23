import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlan } from '../../enterprise/entities/workout-plan'
import { WorkoutPlanExerciseList } from '../../enterprise/entities/workout-plan-exercise-list'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'
import { WorkoutPlanAlreadyExistsError } from './errors/workout-plan-already-exists-error'
import { Injectable } from '@nestjs/common'

interface CreateWorkoutPlanUseCaseRequest {
  ownerId: string
  title: string
}

type CreateWorkoutPlanUseCaseResponse = Either<
  WorkoutPlanAlreadyExistsError,
  {
    workoutPlan: WorkoutPlan
  }
>

@Injectable()
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
