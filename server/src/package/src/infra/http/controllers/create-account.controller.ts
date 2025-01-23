import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'


import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { Public } from '@/infra/auth/public'
import { AuthenticateUserUseCase } from '@/domains/workout/application/use-cases/authenticate-user'
import { InvalidCredentialsError } from '@/domains/workout/application/use-cases/errors/invalid-credentials-error'
import { RegisterUserUseCase } from '@/domains/workout/application/use-cases/register-user'
import { UserAlreadyExistsError } from '@/domains/workout/application/use-cases/errors/user-already-exists-error'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Public()
@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
