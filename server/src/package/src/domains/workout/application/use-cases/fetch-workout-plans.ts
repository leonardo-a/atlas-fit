import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { WorkoutPlanSummary } from '../../enterprise/entities/value-objects/workout-plan-summary'
import { WorkoutPlansRepository } from '../repositories/workout-plans-repository'

interface FetchWotkoutPlansUseCaseRequest {
  page: number
  query: string
  studentId?: string
  authorId?: string
}

type FetchWotkoutPlansUseCaseResponse = Either<
  null,
  { workoutPlans: WorkoutPlanSummary[] }
>

@Injectable()
export class FetchWotkoutPlansUseCase {
  constructor(private workoutPlansRepository: WorkoutPlansRepository) {}

  async execute({
    page,
    query,
    studentId,
    authorId,
  }: FetchWotkoutPlansUseCaseRequest): Promise<FetchWotkoutPlansUseCaseResponse> {
    const workoutPlans = await this.workoutPlansRepository.findMany({
      page,
      query,
      studentId,
      authorId,
    })

    return right({
      workoutPlans,
    })
  }
}
