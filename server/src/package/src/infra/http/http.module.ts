import { Module } from '@nestjs/common'

import { AssignExerciseToWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/assign-exercise-to-workout-plan'
import { AuthenticateUserUseCase } from '@/domains/workout/application/use-cases/authenticate-user'
import { CreateExerciseUseCase } from '@/domains/workout/application/use-cases/create-exercise'
import { CreateWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/create-workout-plan'
import { RegisterUserUseCase } from '@/domains/workout/application/use-cases/register-user'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AssignExerciseToWorkoutPlanController } from './controllers/assign-exercise-to-workout-plan.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateExerciseController } from './controllers/create-exercise.controller'
import { CreateWorkoutPlanController } from './controllers/create-workout-plan.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateWorkoutPlanController,
    CreateExerciseController,
    AssignExerciseToWorkoutPlanController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    CreateWorkoutPlanUseCase,
    CreateExerciseUseCase,
    AssignExerciseToWorkoutPlanUseCase,
  ],
})
export class HttpModule {}
