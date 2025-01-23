import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WorkoutPlan,
  WorkoutPlanProps,
} from '@/domains/workout/enterprise/entities/workout-plan'

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
