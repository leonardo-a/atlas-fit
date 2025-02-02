import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EditExerciseUseCase } from '@/domains/workout/application/use-cases/edit-exercise'
import { ExerciseAlreadyExistsError } from '@/domains/workout/application/use-cases/errors/exercise-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const editExerciseBodySchema = z.object({
  name: z.string(),
  videoUrl: z.string().url().optional(),
  description: z.string().optional(),
})

type EditExerciseBodySchema = z.infer<typeof editExerciseBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editExerciseBodySchema)

@Controller('/exercises/:id')
export class EditExerciseController {
  constructor(private editExercise: EditExerciseUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditExerciseBodySchema,
    @Param('id') exerciseId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, videoUrl, description } = body

    if (user.role === 'STUDENT') {
      throw new UnauthorizedException()
    }

    const result = await this.editExercise.execute({
      exerciseId,
      name,
      videoUrl,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ExerciseAlreadyExistsError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
