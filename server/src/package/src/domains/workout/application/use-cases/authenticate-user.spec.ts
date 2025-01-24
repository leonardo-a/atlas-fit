import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateUserUseCase } from './authenticate-user'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { makeStudent } from 'test/factories/make-student'
import { makePersonalTrainer } from 'test/factories/make-personal-trainer'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryPersonalTrainersRepository =
      new InMemoryPersonalTrainersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryStudentsRepository,
      inMemoryPersonalTrainersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate as a student', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentsRepository.items.push(student)

    const response = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )

    if (response.isRight()) {
      expect(JSON.parse(response.value.accessToken)).toEqual(
        expect.objectContaining({
          role: 'STUDENT',
        }),
      )
    }
  })

  it('should be able to authenticate as a personal trainer', async () => {
    const personalTrainer = makePersonalTrainer({
      email: 'johndoe@email.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)

    const response = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )

    if (response.isRight()) {
      expect(JSON.parse(response.value.accessToken)).toEqual(
        expect.objectContaining({
          role: 'PERSONAL_TRAINER',
        }),
      )
    }
  })

  it('should not be able to authenticate with wrong email', async () => {
    const response = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentsRepository.items.push(student)

    const response = await sut.execute({
      email: 'johndoe@email.com',
      password: '654321',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
