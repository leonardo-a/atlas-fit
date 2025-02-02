import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'

export interface WorkoutPlanSummaryProps {
  id: UniqueEntityID
  title: string
  slug: Slug
  description?: string | null
  authorId: UniqueEntityID
  author: string
  student: string
  exercises: number
}

export class WorkoutPlanSummary extends ValueObject<WorkoutPlanSummaryProps> {
  get id() {
    return this.props.id
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get student() {
    return this.props.student
  }

  get exercises() {
    return this.props.exercises
  }

  static create(props: WorkoutPlanSummaryProps) {
    return new WorkoutPlanSummary(props)
  }
}
