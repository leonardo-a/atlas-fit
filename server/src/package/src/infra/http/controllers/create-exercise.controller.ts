import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateExerciseUseCase } from '@/domains/workout/application/use-cases/create-exercise'
import { ExerciseAlreadyExistsError } from '@/domains/workout/application/use-cases/errors/exercise-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createExerciseBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

type CreateExerciseBodySchema = z.infer<typeof createExerciseBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createExerciseBodySchema)

@Controller('/exercises')
export class CreateExerciseController {
  constructor(private createExercise: CreateExerciseUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateExerciseBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, description } = body

    const result = await this.createExercise.execute({
      name,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ExerciseAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
