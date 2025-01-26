import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { z } from 'zod'

import { FetchExercisesUseCase } from '@/domains/workout/application/use-cases/fetch-exercises'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ExercisePresenter } from '../presenters/exercise-presenter'

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

@Controller('/exercises')
export class FetchExercisesController {
  constructor(private fetchExercises: FetchExercisesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query(queryValidationPipe) queryParams: QueryParamsSchema) {
    const { page, query } = queryParams

    const result = await this.fetchExercises.execute({
      page,
      query,
    })

    return {
      exercises: result.value?.exercises.map(ExercisePresenter.toHTTP),
    }
  }
}
