import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'

export interface WorkoutPlanWithDetailsProps {
  id: UniqueEntityID
  title: string
  slug: Slug
  authorId: UniqueEntityID
  author: string
  studentId: UniqueEntityID
  student: string
  createdAt: Date
  updatedAt?: Date | null
}

export class WorkoutPlanWithDetails extends ValueObject<WorkoutPlanWithDetailsProps> {
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

  get studentId() {
    return this.props.studentId
  }

  get student() {
    return this.props.student
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: WorkoutPlanWithDetailsProps) {
    return new WorkoutPlanWithDetails(props)
  }
}
