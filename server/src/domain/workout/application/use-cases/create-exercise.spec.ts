import { makeExercise } from 'test/factories/make-exercise'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { CreateExerciseUseCase } from './create-exercise'
import { ExerciseAlreadyExistsError } from './errors/exercise-already-exists-error'

let inMemoryExercisesRepository: InMemoryExercisesRepository
let sut: CreateExerciseUseCase

describe('Create Exercise Use Case', () => {
  beforeEach(() => {
    inMemoryExercisesRepository = new InMemoryExercisesRepository()

    sut = new CreateExerciseUseCase(inMemoryExercisesRepository)
  })

  it('should be able to create an exercise', async () => {
    const response = await sut.execute({
      name: 'Bench press',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryExercisesRepository.items).toHaveLength(1)
  })

  it('should not be able to create the same exercise twice', async () => {
    const exercise = makeExercise({
      name: 'Bench press',
    })

    inMemoryExercisesRepository.items.push(exercise)

    const response = await sut.execute({
      name: 'Bench press',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ExerciseAlreadyExistsError)
  })
})
