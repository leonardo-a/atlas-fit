import { Either, left, right } from '@/core/either'
import { Exercise } from '../../enterprise/entities/exercise'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { ExerciseAlreadyExistsError } from './errors/exercise-already-exists-error'
import { Injectable } from '@nestjs/common'

interface CreateExerciseUseCaseRequest {
  name: string
  description?: string | null
}

type CreateExerciseUseCaseResponse = Either<
  ExerciseAlreadyExistsError,
  {
    exercise: Exercise
  }
>

@Injectable()
export class CreateExerciseUseCase {
  constructor(private exercisesRepository: ExercisesRepository) {}

  async execute({
    name,
    description,
  }: CreateExerciseUseCaseRequest): Promise<CreateExerciseUseCaseResponse> {
    const exercise = Exercise.create({
      name,
      description,
    })

    const exerciseWithSameSlug = await this.exercisesRepository.findBySlug(
      exercise.slug.value,
    )

    if (exerciseWithSameSlug) {
      return left(new ExerciseAlreadyExistsError(name))
    }

    await this.exercisesRepository.create(exercise)

    return right({
      exercise,
    })
  }
}
