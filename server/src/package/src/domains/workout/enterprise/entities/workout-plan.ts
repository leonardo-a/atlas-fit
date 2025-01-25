import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'
import { WorkoutPlanExerciseList } from './workout-plan-exercise-list'

export interface WorkoutPlanProps {
  title: string
  slug: Slug
  description?: string | null
  authorId: UniqueEntityID
  studentId: UniqueEntityID
  exercises: WorkoutPlanExerciseList
  createdAt: Date
  updatedAt?: Date | null
}

export class WorkoutPlan extends AggregateRoot<WorkoutPlanProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    const timestamp = new Date().getTime()

    this.props.title = title
    this.props.slug = Slug.createFromText(title.concat(`-${timestamp}`))
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get description() {
    return this.props.description
  }

  set description(description: string | undefined | null) {
    this.description = description

    this.touch()
  }

  get studentId() {
    return this.props.studentId
  }

  get authorId() {
    return this.props.authorId
  }

  get exercises() {
    return this.props.exercises
  }

  set exercises(exercises: WorkoutPlanExerciseList) {
    this.props.exercises = exercises

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<WorkoutPlanProps, 'createdAt' | 'slug' | 'exercises'>,
    id?: UniqueEntityID,
  ) {
    const workoutplan = new WorkoutPlan(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        exercises: props.exercises ?? new WorkoutPlanExerciseList(),
        slug: props.slug ?? Slug.createFromText(props.title),
      },
      id,
    )

    return workoutplan
  }
}
