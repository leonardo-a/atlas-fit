import { UseCaseError } from '@/core/errors/use-case-error'

export class ExerciseLimitReachedError extends Error implements UseCaseError {
  constructor() {
    super('Exercise limit reached for this workout plan.')
  }
}
