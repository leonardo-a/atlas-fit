import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WorkoutPlan,
  WorkoutPlanProps,
} from '@/domains/workout/enterprise/entities/workout-plan'
import { PrismaWorkoutPlanMapper } from '@/infra/database/prisma/mappers/prisma-workout-plan-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeWorkoutPlan(
  override: Partial<WorkoutPlanProps> = {},
  id?: UniqueEntityID,
) {
  const workoutPlan = WorkoutPlan.create(
    {
      title: faker.word.adjective(),
      ownerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return workoutPlan
}

@Injectable()
export class WorkoutPlanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaExercise(
    data: Partial<WorkoutPlanProps> = {},
  ): Promise<WorkoutPlan> {
    const workoutPlan = makeWorkoutPlan(data)

    await this.prisma.workoutPlan.create({
      data: PrismaWorkoutPlanMapper.toPrisma(workoutPlan),
    })

    return workoutPlan
  }
}
