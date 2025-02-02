import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { FetchExercisesUseCase } from './fetch-exercises'
import { makeExercise } from 'test/factories/make-exercise'

let inMemoryExercisesRepository: InMemoryExercisesRepository
let sut: FetchExercisesUseCase

describe('Fetch Exercises Use Case', () => {
  beforeEach(() => {
    inMemoryExercisesRepository = new InMemoryExercisesRepository()

    sut = new FetchExercisesUseCase(inMemoryExercisesRepository)
  })

  it('should be able to fetch exercises', async () => {
    inMemoryExercisesRepository.items.push(
      makeExercise({
        name: 'Bench Press',
      }),
      makeExercise({
        name: 'Squat',
      }),
    )

    const result = await sut.execute({
      page: 1,
      query: '',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.exercises).toHaveLength(2)
  })

  it('should be able to search for exercises', async () => {
    inMemoryExercisesRepository.items.push(
      makeExercise({
        name: 'Bench Press',
      }),
      makeExercise({
        name: 'Squat',
      }),
    )

    const result = await sut.execute({
      page: 1,
      query: 'bench',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.exercises).toHaveLength(1)
  })

  it('should be able to fetch paginated exercises', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryExercisesRepository.items.push(
        makeExercise({
          name: `Exercise ${i}`,
        }),
      )
    }

    const result = await sut.execute({
      query: '',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.exercises).toHaveLength(2)
    expect(result.value?.exercises).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Exercise 21',
        }),
        expect.objectContaining({
          name: 'Exercise 22',
        }),
      ]),
    )
  })
})
