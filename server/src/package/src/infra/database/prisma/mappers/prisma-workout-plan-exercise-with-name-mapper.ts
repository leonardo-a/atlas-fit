import {
  Exercise as PrismaExercise,
  WorkoutPlanExercise as PrismaWorkoutPlanExercise,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlanExerciseWithName } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-exercise-with-name'

type PrismaWorkoutPlanExerciseWithDetails = PrismaWorkoutPlanExercise & {
  exercise: PrismaExercise
}

export class PrismaWorkoutPlanExerciseWithNameMapper {
  static toDomain(
    raw: PrismaWorkoutPlanExerciseWithDetails,
  ): WorkoutPlanExerciseWithName {
    return WorkoutPlanExerciseWithName.create({
      workoutPlanExerciseId: new UniqueEntityID(raw.id),
      exerciseId: new UniqueEntityID(raw.exercise.id),
      name: raw.exercise.name,
      repetitions: raw.repetitions,
      sets: raw.sets,
    })
  }
}
