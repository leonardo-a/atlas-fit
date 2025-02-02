import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetWorkoutPlanDetailsUseCase } from '@/domains/workout/application/use-cases/get-workout-plan-details'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { WorkoutPlanWithDetailsPresenter } from '../presenters/workout-plan-with-details-presenter'

const paramSchema = z.string().uuid()

const paramValidationPipe = new ZodValidationPipe(paramSchema)

type ParamSchema = z.infer<typeof paramSchema>

@Controller('/workout-plans/:workoutPlanId')
export class GetWorkoutPlanDetailsController {
  constructor(private getWorkoutPlanDetails: GetWorkoutPlanDetailsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('workoutPlanId', paramValidationPipe) workoutPlanId: ParamSchema,
  ) {
    const result = await this.getWorkoutPlanDetails.execute({
      id: workoutPlanId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      workoutPlan: WorkoutPlanWithDetailsPresenter.toHTTP(
        result.value.workoutPlan,
      ),
    }
  }
}
