import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domains/workout/enterprise/entities/value-objects/slug'
import { WorkoutPlan } from '@/domains/workout/enterprise/entities/workout-plan'
import { Prisma, WorkoutPlan as PrismaWorkoutPlan } from '@prisma/client'

export class PrismaWorkoutPlanMapper {
  static toDomain(raw: PrismaWorkoutPlan): WorkoutPlan {
    return WorkoutPlan.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        title: raw.title,
        createdAt: raw.createdAt,
        slug: Slug.create(raw.slug),
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    workoutPlan: WorkoutPlan,
  ): Prisma.WorkoutPlanUncheckedCreateInput {
    return {
      id: workoutPlan.id.toString(),
      ownerId: workoutPlan.ownerId.toString(),
      title: workoutPlan.title,
      slug: workoutPlan.slug.value,
      createdAt: workoutPlan.createdAt,
      updatedAt: workoutPlan.updatedAt,
    }
  }
}
