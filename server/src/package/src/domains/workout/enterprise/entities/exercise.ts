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

  set name(name: string) {
    this.props.name = name
    this.props.slug = Slug.createFromText(name)

    this.touch()
  }

  get videoUrl() {
    return this.props.videoUrl
  }

  set videoUrl(url: string | null | undefined) {
    this.props.videoUrl = url
  }

  get slug() {
    return this.props.slug
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null | undefined) {
    this.props.description = description
  }

  private touch() {
    // this.props.updatedAt = new Date()
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
