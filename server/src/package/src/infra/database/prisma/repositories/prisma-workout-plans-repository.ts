import { Injectable } from '@nestjs/common'

import {
  WorkoutPlansFilterParams,
  WorkoutPlansRepository,
} from '@/domains/workout/application/repositories/workout-plans-repository'
import { WorkoutPlan } from '@/domains/workout/enterprise/entities/workout-plan'
import { PrismaWorkoutPlanMapper } from '../mappers/prisma-workout-plan-mapper'
import { PrismaService } from '../prisma.service'
import { WorkoutPlanSummary } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-summary'
import { PrismaWorkoutPlanSummaryMapper } from '../mappers/prisma-workout-plan-summary-mapper'

@Injectable()
export class PrismaWorkoutPlansRepository implements WorkoutPlansRepository {
  constructor(private prisma: PrismaService) {}

  async findMany({
    page,
    query,
    studentId,
  }: WorkoutPlansFilterParams): Promise<WorkoutPlanSummary[]> {
    const workoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        title: {
          contains: query,
        },
        studentId: studentId ?? { contains: '' },
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        author: true,
        workoutPlanExercises: true,
      },
    })

    return workoutPlans.map(PrismaWorkoutPlanSummaryMapper.toDomain)
  }

  async findBySlug(slug: string): Promise<WorkoutPlan | null> {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: {
        slug,
      },
    })

    if (!workoutPlan) {
      return null
    }

    return PrismaWorkoutPlanMapper.toDomain(workoutPlan)
  }

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
