import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/create-workout-plan'
import { WorkoutPlanAlreadyExistsError } from '@/domains/workout/application/use-cases/errors/workout-plan-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createWorkoutPlanBodySchema = z.object({
  title: z.string(),
})

type CreateWorkoutPlanBodySchema = z.infer<typeof createWorkoutPlanBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createWorkoutPlanBodySchema)

@Controller('/workout-plan')
export class CreateWorkoutPlanController {
  constructor(private createWorkoutPlan: CreateWorkoutPlanUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateWorkoutPlanBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title } = body
    const ownerId = user.sub

    const result = await this.createWorkoutPlan.execute({
      title,
      ownerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WorkoutPlanAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
