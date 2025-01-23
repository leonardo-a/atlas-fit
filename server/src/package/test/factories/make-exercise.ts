import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Exercise,
  ExerciseProps,
} from '@/domains/workout/enterprise/entities/exercise'

export function makeExercise(
  override: Partial<ExerciseProps> = {},
  id?: UniqueEntityID,
) {
  const exercise = Exercise.create(
    {
      name: faker.word.adjective(),
      description: faker.lorem.paragraph(),
      ...override,
    },
    id,
  )

  return exercise
}
