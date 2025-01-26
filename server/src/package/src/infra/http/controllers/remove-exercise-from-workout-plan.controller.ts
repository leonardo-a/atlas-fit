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
import { RemoveExerciseFromWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/remove-exercise-from-workout-plan'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/workout-plans/exercises/:workoutPlanExerciseId')
export class RemoveExerciseFromWorkoutPlanController {
  constructor(
    private deleteWrokoutPlan: RemoveExerciseFromWorkoutPlanUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('workoutPlanExerciseId') workoutPlanExerciseId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub

    const result = await this.deleteWrokoutPlan.execute({
      authorId,
      workoutPlanExerciseId,
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
