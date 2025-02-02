import {
  Exercise as PrismaExercise,
  WorkoutPlanExercise as PrismaWorkoutPlanExercise,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlanExerciseWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-exercise-with-details'

type PrismaWorkoutPlanExerciseWithDetails = PrismaWorkoutPlanExercise & {
  exercise: PrismaExercise
}

export class PrismaWorkoutPlanExerciseWithDetailsMapper {
  static toDomain(
    raw: PrismaWorkoutPlanExerciseWithDetails,
  ): WorkoutPlanExerciseWithDetails {
    return WorkoutPlanExerciseWithDetails.create({
      workoutPlanExerciseId: new UniqueEntityID(raw.id),
      exerciseId: new UniqueEntityID(raw.exercise.id),
      name: raw.exercise.name,
      repetitions: raw.repetitions,
      sets: raw.sets,
      videoUrl: raw.exercise.videoUrl,
    })
  }
}
