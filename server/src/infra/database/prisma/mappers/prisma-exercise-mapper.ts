import { Prisma, Exercise as PrismaExercise } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Exercise } from '@/domains/workout/enterprise/entities/exercise'
import { Slug } from '@/domains/workout/enterprise/entities/value-objects/slug'

export class PrismaExerciseMapper {
  static toDomain(raw: PrismaExercise): Exercise {
    return Exercise.create(
      {
        name: raw.name,
        description: raw.description,
        videoUrl: raw.videoUrl,
        slug: Slug.create(raw.slug),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(exercise: Exercise): Prisma.ExerciseUncheckedCreateInput {
    return {
      id: exercise.id.toString(),
      name: exercise.name,
      slug: exercise.slug.value,
      videoUrl: exercise.videoUrl,
      description: exercise.description,
    }
  }
}
