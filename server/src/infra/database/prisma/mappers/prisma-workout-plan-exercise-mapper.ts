import {
  Prisma,
  WorkoutPlanExercise as PrismaWorkoutPlanExercise,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WorkoutPlanExercise } from '@/domains/workout/enterprise/entities/workout-plan-exercise'

export class PrismaWorkoutPlanExerciseMapper {
  static toDomain(raw: PrismaWorkoutPlanExercise): WorkoutPlanExercise {
    return WorkoutPlanExercise.create(
      {
        workoutPlanId: new UniqueEntityID(raw.workoutPlanId),
        exerciseId: new UniqueEntityID(raw.exerciseId),
        repetitions: raw.repetitions,
        sets: raw.sets,
        weekDay: raw.weekDay,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    workoutPlanExercise: WorkoutPlanExercise,
  ): Prisma.WorkoutPlanExerciseUncheckedCreateInput {
    return {
      id: workoutPlanExercise.id.toString(),
      workoutPlanId: workoutPlanExercise.workoutPlanId.toString(),
      exerciseId: workoutPlanExercise.exerciseId.toString(),
      repetitions: workoutPlanExercise.repetitions,
      sets: workoutPlanExercise.sets,
      weekDay: workoutPlanExercise.weekDay,
      updatedAt: workoutPlanExercise.updatedAt,
    }
  }
}
