import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchWeekDayWorkoutPlanExercisesUseCase } from '@/domains/workout/application/use-cases/fetch-week-day-workout-plan-exercises'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { WorkoutPlanExerciseWithNamePresenter } from '../presenters/workout-plan-exercise-with-name-presenter'

const weekDayQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1).max(7))

const queryValidationPipe = new ZodValidationPipe(weekDayQueryParamSchema)

type WeekDayQueryParamSchema = z.infer<typeof weekDayQueryParamSchema>

@Controller('/workout-plans/:workoutPlanId/exercises')
export class FetchWeekDayWorkoutPlanExercisesController {
  constructor(
    private fetchWeekDayWorkoutPlanExercises: FetchWeekDayWorkoutPlanExercisesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('weekDay', queryValidationPipe) weekDay: WeekDayQueryParamSchema,
    @Param('workoutPlanId') workoutPlanId: string,
  ) {
    const userId = user.sub

    const result = await this.fetchWeekDayWorkoutPlanExercises.execute({
      userId,
      weekDay,
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

    return {
      weekDayExercises: result.value.weekDayExercises.map(
        WorkoutPlanExerciseWithNamePresenter.toHTTP,
      ),
    }
  }
}
