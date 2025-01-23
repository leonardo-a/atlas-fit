import { Module } from '@nestjs/common'

import { ExercisesRepository } from '@/domains/workout/application/repositories/exercises-repository'
import { UsersRepository } from '@/domains/workout/application/repositories/users-repository'
import { WorkoutPlanExercisesRepository } from '@/domains/workout/application/repositories/workout-plan-exercises-repository'
import { WorkoutPlansRepository } from '@/domains/workout/application/repositories/workout-plans-repository'
import { PrismaService } from './prisma/prisma.service'
import { PrismaExercisesRepository } from './prisma/repositories/prisma-exercises-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { PrismaWorkoutPlanExercisesRepository } from './prisma/repositories/prisma-workout-plan-exercises-repository'
import { PrismaWorkoutPlansRepository } from './prisma/repositories/prisma-workout-plans-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: ExercisesRepository,
      useClass: PrismaExercisesRepository,
    },
    {
      provide: WorkoutPlansRepository,
      useClass: PrismaWorkoutPlansRepository,
    },
    {
      provide: WorkoutPlanExercisesRepository,
      useClass: PrismaWorkoutPlanExercisesRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    ExercisesRepository,
    WorkoutPlansRepository,
    WorkoutPlanExercisesRepository,
  ],
})
export class DatabaseModule {}
