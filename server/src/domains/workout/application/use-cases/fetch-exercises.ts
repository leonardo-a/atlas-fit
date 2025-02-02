import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { Exercise } from '../../enterprise/entities/exercise'
import { ExercisesRepository } from '../repositories/exercises-repository'

interface FetchExercisesUseCaseRequest {
  page: number
  query: string
}

type FetchExercisesUseCaseResponse = Either<null, { exercises: Exercise[] }>

@Injectable()
export class FetchExercisesUseCase {
  constructor(private exercisesRepository: ExercisesRepository) {}

  async execute({
    page,
    query,
  }: FetchExercisesUseCaseRequest): Promise<FetchExercisesUseCaseResponse> {
    const exercises = await this.exercisesRepository.findMany({
      page,
      query,
    })

    return right({
      exercises,
    })
  }
}
