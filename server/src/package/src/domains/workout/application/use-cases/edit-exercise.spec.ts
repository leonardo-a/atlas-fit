import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeExercise } from 'test/factories/make-exercise'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { EditExerciseUseCase } from './edit-exercise'
import { ExerciseAlreadyExistsError } from './errors/exercise-already-exists-error'

let inMemoryExercisesRepository: InMemoryExercisesRepository
let sut: EditExerciseUseCase

describe('Edit Exercise Use Case', () => {
  beforeEach(() => {
    inMemoryExercisesRepository = new InMemoryExercisesRepository()

    sut = new EditExerciseUseCase(inMemoryExercisesRepository)
  })

  it('should be able to edit an exercise', async () => {
    const exercise = makeExercise({
      name: 'Bench Pressss',
    })

    inMemoryExercisesRepository.items.push(exercise)

    const response = await sut.execute({
      exerciseId: exercise.id.toString(),
      name: 'Bench press',
    })

    console.log(inMemoryExercisesRepository.items)

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryExercisesRepository.items).toHaveLength(1)
    expect(inMemoryExercisesRepository.items[0].name).toEqual('Bench press')
  })

  it('should be able to edit an exercise name only if it is different', async () => {
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryExercisesRepository.items.push(exercise)

    const response = await sut.execute({
      exerciseId: exercise.id.toString(),
      name: 'Bench press',
      description: 'A new description',
    })

    console.log(inMemoryExercisesRepository.items)

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryExercisesRepository.items).toHaveLength(1)
    expect(inMemoryExercisesRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Bench Press',
        description: 'A new description',
      }),
    )
  })

  it('should be able to edit an exercise name with an already existing name', async () => {
    const exercise = makeExercise({
      name: 'Bench Presss',
    })

    const exercise2 = makeExercise({
      name: 'Bench press',
      slug: Slug.createFromText('Bench press'),
    })

    inMemoryExercisesRepository.items.push(exercise, exercise2)

    const response = await sut.execute({
      exerciseId: exercise.id.toString(),
      name: 'Bench press',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ExerciseAlreadyExistsError)
  })

  it('should not be able to edit an unexisting exercise', async () => {
    const response = await sut.execute({
      exerciseId: 'invalid-id',
      name: 'Bench press',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
