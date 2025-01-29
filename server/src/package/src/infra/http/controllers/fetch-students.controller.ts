import {
  Controller,
  Get,
  HttpCode,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { FetchStudentsUseCase } from '@/domains/workout/application/use-cases/fetch-students'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { StudentPresenter } from '../presenters/student-presenter'

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

@Controller('/students')
export class FetchStudentsController {
  constructor(private fetchStudents: FetchStudentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) queryParams: QueryParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    if (user.role === 'STUDENT') {
      throw new UnauthorizedException()
    }

    const { page, query } = queryParams

    const result = await this.fetchStudents.execute({
      page,
      query,
    })

    return {
      students: result.value?.students.map(StudentPresenter.toHTTP),
    }
  }
}
