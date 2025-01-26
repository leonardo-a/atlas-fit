import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AssignExerciseToWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/assign-exercise-to-workout-plan'
import { WorkoutPlanExerciseAlreadyExistsOnWeekDayError } from '@/domains/workout/application/use-cases/errors/workout-plan-exercise-already-exists-on-week-day-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const assignExerciseToWorkoutPlanBodySchema = z.object({
  exerciseId: z.string().uuid(),
  repetitions: z.number().int().positive(),
  sets: z.number().int().positive(),
  weekDay: z.number().int().positive().min(1).max(7),
})

type AssignExerciseToWorkoutPlanBodySchema = z.infer<
  typeof assignExerciseToWorkoutPlanBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  assignExerciseToWorkoutPlanBodySchema,
)

@Controller('/workout-plans/:workoutPlanId/exercises')
export class AssignExerciseToWorkoutPlanController {
  constructor(
    private assignExerciseToWorkoutPlan: AssignExerciseToWorkoutPlanUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param('workoutPlanId') workoutPlanId: string,
    @Body(bodyValidationPipe) body: AssignExerciseToWorkoutPlanBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { exerciseId, repetitions, sets, weekDay } = body
    const userId = user.sub

    const result = await this.assignExerciseToWorkoutPlan.execute({
      userId,
      exerciseId,
      repetitions,
      sets,
      weekDay,
      workoutPlanId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WorkoutPlanExerciseAlreadyExistsOnWeekDayError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
