import { Module } from '@nestjs/common'

import { AssignExerciseToWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/assign-exercise-to-workout-plan'
import { AuthenticateUserUseCase } from '@/domains/workout/application/use-cases/authenticate-user'
import { CreateExerciseUseCase } from '@/domains/workout/application/use-cases/create-exercise'
import { CreateWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/create-workout-plan'
import { DeleteWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/delete-workout-plan'
import { FetchExercisesUseCase } from '@/domains/workout/application/use-cases/fetch-exercises'
import { FetchStudentsUseCase } from '@/domains/workout/application/use-cases/fetch-students'
import { FetchWeekDayWorkoutPlanExercisesUseCase } from '@/domains/workout/application/use-cases/fetch-week-day-workout-plan-exercises'
import { FetchWorkoutPlansUseCase } from '@/domains/workout/application/use-cases/fetch-workout-plans'
import { GetWorkoutPlanDetailsUseCase } from '@/domains/workout/application/use-cases/get-workout-plan-details'
import { RegisterStudentUseCase } from '@/domains/workout/application/use-cases/register-student'
import { RemoveExerciseFromWorkoutPlanUseCase } from '@/domains/workout/application/use-cases/remove-exercise-from-workout-plan'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AssignExerciseToWorkoutPlanController } from './controllers/assign-exercise-to-workout-plan.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateExerciseController } from './controllers/create-exercise.controller'
import { CreateWorkoutPlanController } from './controllers/create-workout-plan.controller'
import { DeleteWrokoutPlanController } from './controllers/delete-workout-plan.controller'
import { FetchExercisesController } from './controllers/fetch-exercises.controller'
import { FetchStudentsController } from './controllers/fetch-students.controller'
import { FetchWeekDayWorkoutPlanExercisesController } from './controllers/fetch-week-day-workout-plan-exercises.controller'
import { FetchWorkoutPlansController } from './controllers/fetch-workout-plans.controller'
import { GetWorkoutPlanDetailsController } from './controllers/get-workout-plan-details.controller'
import { RemoveExerciseFromWorkoutPlanController } from './controllers/remove-exercise-from-workout-plan.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateWorkoutPlanController,
    CreateExerciseController,
    AssignExerciseToWorkoutPlanController,
    DeleteWrokoutPlanController,
    RemoveExerciseFromWorkoutPlanController,
    FetchWorkoutPlansController,
    FetchWeekDayWorkoutPlanExercisesController,
    GetWorkoutPlanDetailsController,
    FetchExercisesController,
    FetchStudentsController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterStudentUseCase,
    CreateWorkoutPlanUseCase,
    CreateExerciseUseCase,
    AssignExerciseToWorkoutPlanUseCase,
    DeleteWorkoutPlanUseCase,
    RemoveExerciseFromWorkoutPlanUseCase,
    FetchWorkoutPlansUseCase,
    FetchWeekDayWorkoutPlanExercisesUseCase,
    GetWorkoutPlanDetailsUseCase,
    FetchExercisesUseCase,
    FetchStudentsUseCase,
  ],
})
export class HttpModule {}
