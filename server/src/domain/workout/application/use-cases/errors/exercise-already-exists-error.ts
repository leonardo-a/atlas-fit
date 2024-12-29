export class ExerciseAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`Exercise '${identifier}' already exists.`)
  }
}
