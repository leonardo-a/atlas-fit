import {
  User as PrismaUser,
  WorkoutPlan as PrismaWorkoutPlan,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domains/workout/enterprise/entities/value-objects/slug'
import { WorkoutPlanWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-with-details'

type PrismaWorkoutPlanWithDetails = PrismaWorkoutPlan & {
  author: PrismaUser
  student: PrismaUser
}

export class PrismaWorkoutPlanWithDetailsMapper {
  static toDomain(raw: PrismaWorkoutPlanWithDetails): WorkoutPlanWithDetails {
    return WorkoutPlanWithDetails.create({
      id: new UniqueEntityID(raw.id),
      author: raw.author.name,
      authorId: new UniqueEntityID(raw.authorId),
      student: raw.student.name,
      studentId: new UniqueEntityID(raw.studentId),
      title: raw.title,
      slug: Slug.create(raw.slug),
      description: raw.description,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
