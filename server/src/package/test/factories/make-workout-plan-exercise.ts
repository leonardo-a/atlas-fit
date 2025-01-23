import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WorkoutPlanExercise,
  WorkoutPlanExerciseProps,
} from '@/domains/workout/enterprise/entities/workout-plan-exercise'
import { PrismaWorkoutPlanExerciseMapper } from '@/infra/database/prisma/mappers/prisma-workout-plan-exercise-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeWorkoutPlanExercise(
  override: Partial<WorkoutPlanExerciseProps> = {},
  id?: UniqueEntityID,
) {
  const workoutPlanExercise = WorkoutPlanExercise.create(
    {
      exerciseId: new UniqueEntityID(),
      workoutPlanId: new UniqueEntityID(),
      repetitions: faker.number.int({ min: 6, max: 12 }),
      sets: faker.number.int({ min: 2, max: 5 }),
      weekDay: faker.number.int({ min: 1, max: 7 }),
      ...override,
    },
    id,
  )

  return workoutPlanExercise
}

@Injectable()
export class WorkoutPlanExerciseFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaExercise(
    data: Partial<WorkoutPlanExerciseProps> = {},
  ): Promise<WorkoutPlanExercise> {
    const workoutPlanExercise = makeWorkoutPlanExercise(data)

    await this.prisma.workoutPlanExercise.create({
      data: PrismaWorkoutPlanExerciseMapper.toPrisma(workoutPlanExercise),
    })

    return workoutPlanExercise
  }
}
