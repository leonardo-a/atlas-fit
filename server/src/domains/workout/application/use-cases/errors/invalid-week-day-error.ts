import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidWeekDayError extends Error implements UseCaseError {
  constructor() {
    super('Invalid week day.')
  }
}
