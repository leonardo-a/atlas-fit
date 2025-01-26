import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { z } from 'zod'

import { FetchWorkoutPlansUseCase } from '@/domains/workout/application/use-cases/fetch-workout-plans'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { WorkoutPlanSummaryPresenter } from '../presenters/workout-plan-summary-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string().default(''),
})

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema)

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

@Controller('/workout-plans')
export class FetchWorkoutPlansController {
  constructor(private fetchWorkoutPlans: FetchWorkoutPlansUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) queryParams: QueryParamsSchema,
  ) {
    const { page, query } = queryParams

    const workoutPlans = await this.fetchWorkoutPlans.execute({
      page,
      query,
      authorId: user.role === 'PERSONAL_TRAINER' ? user.sub : undefined,
      studentId: user.role === 'STUDENT' ? user.sub : undefined,
    })

    return {
      workoutPlans: workoutPlans.value?.workoutPlans.map(
        WorkoutPlanSummaryPresenter.toHTTP,
      ),
    }
  }
}
