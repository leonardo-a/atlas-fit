import { Injectable } from '@nestjs/common'

import { FilterParams } from '@/core/repositories/filter-params'
import { ExercisesRepository } from '@/domains/workout/application/repositories/exercises-repository'
import { Exercise } from '@/domains/workout/enterprise/entities/exercise'
import { PrismaExerciseMapper } from '../mappers/prisma-exercise-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaExercisesRepository implements ExercisesRepository {
  constructor(private prisma: PrismaService) {}

  async findMany({ page, query }: FilterParams): Promise<Exercise[]> {
    const limit = 20

    const exercises = await this.prisma.exercise.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    return exercises.map(PrismaExerciseMapper.toDomain)
  }

  async findById(id: string): Promise<Exercise | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        id,
      },
    })

    if (!exercise) {
      return null
    }

    return PrismaExerciseMapper.toDomain(exercise)
  }

  async findBySlug(slug: string): Promise<Exercise | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        slug,
      },
    })

    if (!exercise) {
      return null
    }

    return PrismaExerciseMapper.toDomain(exercise)
  }

  async create(exercise: Exercise): Promise<void> {
    const data = PrismaExerciseMapper.toPrisma(exercise)

    await this.prisma.exercise.create({ data })
  }
}
