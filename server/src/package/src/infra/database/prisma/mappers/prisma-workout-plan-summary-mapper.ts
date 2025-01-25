import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domains/workout/enterprise/entities/value-objects/slug'
import { WorkoutPlanSummary } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-summary'
import {
  WorkoutPlan as PrismaWorkoutPlan,
  User as PrismaUser,
  WorkoutPlanExercise as PrismaWorkoutPlanExercise,
} from '@prisma/client'

type PrismaWorkoutPlanSummary = PrismaWorkoutPlan & {
  author: PrismaUser
  workoutPlanExercises: PrismaWorkoutPlanExercise[]
}

export class PrismaWorkoutPlanSummaryMapper {
  static toDomain(raw: PrismaWorkoutPlanSummary): WorkoutPlanSummary {
    return WorkoutPlanSummary.create({
      author: raw.author.name,
      authorId: new UniqueEntityID(raw.authorId),
      title: raw.title,
      slug: Slug.create(raw.slug),
      exercises: raw.workoutPlanExercises.length,
      description: raw.description,
    })
  }
}
