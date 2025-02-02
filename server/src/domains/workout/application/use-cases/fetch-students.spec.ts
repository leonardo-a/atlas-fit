import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchStudentsUseCase } from './fetch-students'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchStudentsUseCase

describe('Fetch Students Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    sut = new FetchStudentsUseCase(inMemoryStudentsRepository)
  })

  it('should be able to fetch students', async () => {
    inMemoryStudentsRepository.items.push(
      makeStudent({
        name: 'John doe',
        email: 'johndoe@email.com',
      }),
      makeStudent({
        name: 'Jane doe',
        email: 'janedoe@email.com',
      }),
    )

    const response = await sut.execute({
      page: 1,
      query: 'john',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value?.students).toHaveLength(1)
    expect(response.value?.students[0]).toEqual(
      expect.objectContaining({
        name: 'John doe',
      }),
    )
  })

  it('should be able to fetch paginated students', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryStudentsRepository.items.push(
        makeStudent({
          name: `Student ${i}`,
          email: `student${i}@email.com`,
        }),
      )
    }

    const response = await sut.execute({
      page: 2,
      query: '',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value?.students).toHaveLength(2)
    expect(response.value?.students).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Student 21',
        }),
        expect.objectContaining({
          name: 'Student 22',
        }),
      ]),
    )
  })
})
