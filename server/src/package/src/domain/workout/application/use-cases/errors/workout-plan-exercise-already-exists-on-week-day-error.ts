import { UseCaseError } from '@/core/errors/use-case-error'

export class WorkoutPlanExerciseAlreadyExistsOnWeekDayError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Exercise already assigned on same week day.')
  }
}
