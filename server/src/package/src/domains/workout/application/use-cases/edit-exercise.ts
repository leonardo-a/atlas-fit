import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { ExerciseAlreadyExistsError } from './errors/exercise-already-exists-error'
import { Slug } from '../../enterprise/entities/value-objects/slug'

interface EditExerciseUseCaseRequest {
  exerciseId: string
  name: string
  videoUrl?: string | null
  description?: string | null
}

type EditExerciseUseCaseResponse = Either<
  ResourceNotFoundError | ExerciseAlreadyExistsError,
  null
>

@Injectable()
export class EditExerciseUseCase {
  constructor(private exercisesRepository: ExercisesRepository) {}

  async execute({
    exerciseId,
    name,
    videoUrl,
    description,
  }: EditExerciseUseCaseRequest): Promise<EditExerciseUseCaseResponse> {
    const exercise = await this.exercisesRepository.findById(exerciseId)

    if (!exercise) {
      return left(new ResourceNotFoundError())
    }

    const exerciseWithSameSlug = await this.exercisesRepository.findBySlug(
      Slug.createFromText(name).value,
    )

    if (exerciseWithSameSlug) {
      return left(new ExerciseAlreadyExistsError(name))
    }

    exercise.name = name
    exercise.videoUrl = videoUrl
    exercise.description = description

    await this.exercisesRepository.save(exercise)

    return right(null)
  }
}
