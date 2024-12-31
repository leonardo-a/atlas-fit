import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/workout/application/use-cases/authenticate-user'
import { RegisterUserUseCase } from '@/domain/workout/application/use-cases/register-user'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUserUseCase,
  ],
})
export class HttpModule {}
