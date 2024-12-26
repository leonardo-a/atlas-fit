import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ExerciseProps {
  name: string
  description?: string | null
}

export class Exercise extends Entity<ExerciseProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  static create(props: ExerciseProps, id?: UniqueEntityID) {
    const exercise = new Exercise(
      {
        ...props,
      },
      id,
    )

    return exercise
  }
}
