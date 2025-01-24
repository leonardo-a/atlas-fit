import { Module } from '@nestjs/common'

import { ExercisesRepository } from '@/domains/workout/application/repositories/exercises-repository'
import { PersonalTrainersRepository } from '@/domains/workout/application/repositories/personal-trainers-repository'
import { StudentsRepository } from '@/domains/workout/application/repositories/students-repository'
import { WorkoutPlanExercisesRepository } from '@/domains/workout/application/repositories/workout-plan-exercises-repository'
import { WorkoutPlansRepository } from '@/domains/workout/application/repositories/workout-plans-repository'
import { PrismaService } from './prisma/prisma.service'
import { PrismaExercisesRepository } from './prisma/repositories/prisma-exercises-repository'
import { PrismaPersonalTrainersRepository } from './prisma/repositories/prisma-personal-trainers-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { PrismaWorkoutPlanExercisesRepository } from './prisma/repositories/prisma-workout-plan-exercises-repository'
import { PrismaWorkoutPlansRepository } from './prisma/repositories/prisma-workout-plans-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: PersonalTrainersRepository,
      useClass: PrismaPersonalTrainersRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
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
    PersonalTrainersRepository,
    StudentsRepository,
    ExercisesRepository,
    WorkoutPlansRepository,
    WorkoutPlanExercisesRepository,
  ],
})
export class DatabaseModule {}
