import { Injectable } from '@nestjs/common'

import { WorkoutPlanExercisesRepository } from '@/domains/workout/application/repositories/workout-plan-exercises-repository'
import { WorkoutPlanExerciseWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-exercise-with-details'
import { WorkoutPlanExercise } from '@/domains/workout/enterprise/entities/workout-plan-exercise'
import { PrismaWorkoutPlanExerciseMapper } from '../mappers/prisma-workout-plan-exercise-mapper'
import { PrismaWorkoutPlanExerciseWithDetailsMapper } from '../mappers/prisma-workout-plan-exercise-with-details-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaWorkoutPlanExercisesRepository
  implements WorkoutPlanExercisesRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<WorkoutPlanExercise | null> {
    const workoutPlanExercise =
      await this.prisma.workoutPlanExercise.findUnique({
        where: {
          id,
        },
      })

    if (!workoutPlanExercise) {
      return null
    }

    return PrismaWorkoutPlanExerciseMapper.toDomain(workoutPlanExercise)
  }

  async findManyByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutPlanExercise[]> {
    const workoutPlanExercises = await this.prisma.workoutPlanExercise.findMany(
      {
        where: {
          workoutPlanId,
        },
      },
    )

    return workoutPlanExercises.map(PrismaWorkoutPlanExerciseMapper.toDomain)
  }

  async findManyByWorkoutPlanWeekDay(
    workoutPlanId: string,
    weekDay: number,
  ): Promise<WorkoutPlanExerciseWithDetails[]> {
    const workoutPlanExercises = await this.prisma.workoutPlanExercise.findMany(
      {
        where: {
          workoutPlanId,
          weekDay,
        },
        include: {
          exercise: true,
        },
      },
    )

    return workoutPlanExercises.map(
      PrismaWorkoutPlanExerciseWithDetailsMapper.toDomain,
    )
  }

  async create(workoutPlanExercise: WorkoutPlanExercise): Promise<void> {
    const data = PrismaWorkoutPlanExerciseMapper.toPrisma(workoutPlanExercise)

    await this.prisma.workoutPlanExercise.create({ data })
  }

  async createMany(workoutPlanExercises: WorkoutPlanExercise[]): Promise<void> {
    const data = workoutPlanExercises.map(
      PrismaWorkoutPlanExerciseMapper.toPrisma,
    )

    await this.prisma.workoutPlanExercise.createMany({ data })
  }

  async delete(workoutPlanExercise: WorkoutPlanExercise): Promise<void> {
    await this.prisma.workoutPlanExercise.delete({
      where: {
        id: workoutPlanExercise.id.toString(),
      },
    })
  }

  async deleteManyByWorkoutPlanId(workoutPlanId: string): Promise<void> {
    await this.prisma.workoutPlanExercise.deleteMany({
      where: {
        workoutPlanId,
      },
    })
  }
}
