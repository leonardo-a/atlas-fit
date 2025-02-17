import { Injectable } from '@nestjs/common'

import {
  WorkoutPlansFilterParams,
  WorkoutPlansRepository,
} from '@/domains/workout/application/repositories/workout-plans-repository'
import { WorkoutPlanSummary } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-summary'
import { WorkoutPlanWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-with-details'
import { WorkoutPlan } from '@/domains/workout/enterprise/entities/workout-plan'
import { PrismaWorkoutPlanMapper } from '../mappers/prisma-workout-plan-mapper'
import { PrismaWorkoutPlanSummaryMapper } from '../mappers/prisma-workout-plan-summary-mapper'
import { PrismaWorkoutPlanWithDetailsMapper } from '../mappers/prisma-workout-plan-with-details-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaWorkoutPlansRepository implements WorkoutPlansRepository {
  constructor(private prisma: PrismaService) {}

  async findMany({
    page,
    query,
    studentId,
    authorId,
  }: WorkoutPlansFilterParams): Promise<WorkoutPlanSummary[]> {
    const workoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
        studentId: studentId ?? { contains: '' },
        authorId: authorId ?? { contains: '' },
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        author: true,
        student: true,
        workoutPlanExercises: true,
      },
    })

    return workoutPlans.map(PrismaWorkoutPlanSummaryMapper.toDomain)
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

  async findBySlugWithDetails(
    slug: string,
  ): Promise<WorkoutPlanWithDetails | null> {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        student: true,
      },
    })

    if (!workoutPlan) {
      return null
    }

    return PrismaWorkoutPlanWithDetailsMapper.toDomain(workoutPlan)
  }

  async findByIdWithDetails(
    id: string,
  ): Promise<WorkoutPlanWithDetails | null> {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        student: true,
      },
    })

    if (!workoutPlan) {
      return null
    }

    return PrismaWorkoutPlanWithDetailsMapper.toDomain(workoutPlan)
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
