import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Exercise,
  ExerciseProps,
} from '@/domains/workout/enterprise/entities/exercise'
import { PrismaExerciseMapper } from '@/infra/database/prisma/mappers/prisma-exercise-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeExercise(
  override: Partial<ExerciseProps> = {},
  id?: UniqueEntityID,
) {
  const exercise = Exercise.create(
    {
      name: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      videoUrl: faker.internet.url(),
      ...override,
    },
    id,
  )

  return exercise
}

@Injectable()
export class ExerciseFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaExercise(
    data: Partial<ExerciseProps> = {},
  ): Promise<Exercise> {
    const exercise = makeExercise(data)

    await this.prisma.exercise.create({
      data: PrismaExerciseMapper.toPrisma(exercise),
    })

    return exercise
  }
}
