import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/delete-workout-plan'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/workout-plans/:workoutPlanId')
export class DeleteWrokoutPlanController {
  constructor(private deleteWrokoutPlan: DeleteWorkoutPlanUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('workoutPlanId') workoutPlanId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub

    const result = await this.deleteWrokoutPlan.execute({
      authorId,
      workoutPlanId,
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
  }
}
