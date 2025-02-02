import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateExerciseUseCase } from '@/domains/workout/application/use-cases/create-exercise'
import { ExerciseAlreadyExistsError } from '@/domains/workout/application/use-cases/errors/exercise-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createExerciseBodySchema = z.object({
  name: z.string(),
  videoUrl: z.string().url().optional(),
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
    const { name, videoUrl, description } = body

    if (user.role === 'STUDENT') {
      throw new UnauthorizedException()
    }

    const result = await this.createExercise.execute({
      name,
      videoUrl,
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
