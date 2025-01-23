import { Injectable } from '@nestjs/common'

import { WorkoutPlansRepository } from '@/domains/workout/application/repositories/workout-plans-repository'
import { WorkoutPlan } from '@/domains/workout/enterprise/entities/workout-plan'
import { PrismaWorkoutPlanMapper } from '../mappers/prisma-workout-plan-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaWorkoutPlansRepository implements WorkoutPlansRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<WorkoutPlan | null> {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: {
        id,
      },
    })

    if (!workoutPlan) {
      return null
    }

    return PrismaWorkoutPlanMapper.toDomain(workoutPlan)
  }

  async create(workoutPlan: WorkoutPlan): Promise<void> {
    const data = PrismaWorkoutPlanMapper.toPrisma(workoutPlan)

    await this.prisma.workoutPlan.create({ data })
  }

  async save(workoutPlan: WorkoutPlan): Promise<void> {
    const data = PrismaWorkoutPlanMapper.toPrisma(workoutPlan)

    await this.prisma.workoutPlan.update({
      data,
      where: {
        id: data.id,
      },
    })
  }

  async delete(workoutPlan: WorkoutPlan): Promise<void> {
    await this.prisma.workoutPlan.delete({
      where: {
        id: workoutPlan.id.toString(),
      },
    })
  }
}
