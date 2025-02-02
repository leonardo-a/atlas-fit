import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        student: expect.objectContaining({
          name: 'John Doe',
        }),
      }),
    )
  })

  it('should hash student password upon registration', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      '123456-hashed',
    )
  })

  it('should not be able to register same student twice', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
    })

    inMemoryStudentsRepository.items.push(student)

    const response = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
