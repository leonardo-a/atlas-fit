import { UseCaseError } from '@/core/errors/use-case-error'

export class ExerciseAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Exercise '${identifier}' already exists.`)
  }
}
