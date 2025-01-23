import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  WorkoutPlanExercise,
  WorkoutPlanExerciseProps,
} from '@/domains/workout/enterprise/entities/workout-plan-exercise'

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
