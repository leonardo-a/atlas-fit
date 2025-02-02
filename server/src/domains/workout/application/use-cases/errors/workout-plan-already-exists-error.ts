import { UseCaseError } from '@/core/errors/use-case-error'

export class WorkoutPlanAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Workout Plan '${identifier}' already exists.`)
  }
}
