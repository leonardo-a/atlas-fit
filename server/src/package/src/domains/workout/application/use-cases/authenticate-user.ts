import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { StudentsRepository } from '../repositories/students-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { PersonalTrainersRepository } from '../repositories/personal-trainers-repository'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private personalTrainersRepository: PersonalTrainersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    let user = await this.studentsRepository.findByEmail(email)

    if (!user) {
      user = await this.personalTrainersRepository.findByEmail(email)
    }

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      name: user.name,
      role: user.role,
    })

    return right({
      accessToken,
    })
  }
}
