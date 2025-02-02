import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { Optional } from '@/core/types/optional'

export interface ExerciseProps {
  name: string
  slug: Slug
  videoUrl?: string | null
  description?: string | null
}

export class Exercise extends Entity<ExerciseProps> {
  get name() {
    return this.props.name
  }

  get videoUrl() {
    return this.props.videoUrl
  }

  get slug() {
    return this.props.slug
  }

  get description() {
    return this.props.description
  }

  static create(props: Optional<ExerciseProps, 'slug'>, id?: UniqueEntityID) {
    const exercise = new Exercise(
      {
        slug: props.slug ?? Slug.createFromText(props.name),
        ...props,
      },
      id,
    )

    return exercise
  }
}
