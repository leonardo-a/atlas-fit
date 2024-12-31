import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface WorkoutPlanExerciseProps {
  exerciseId: UniqueEntityID
  workoutPlanId: UniqueEntityID
  weekDay: number
  sets: number
  repetitions: number
  updatedAt?: Date | null
}

export class WorkoutPlanExercise extends Entity<WorkoutPlanExerciseProps> {
  get exerciseId() {
    return this.props.exerciseId
  }

  get workoutPlanId() {
    return this.props.workoutPlanId
  }

  get weekDay() {
    return this.props.weekDay
  }

  set weekDay(value: number) {
    this.props.weekDay = value

    this.touch()
  }

  get sets() {
    return this.props.sets
  }

  set sets(value: number) {
    this.props.sets = value

    this.touch()
  }

  get repetitions() {
    return this.props.repetitions
  }

  set repetitions(value: number) {
    this.props.repetitions = value

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: WorkoutPlanExerciseProps, id?: UniqueEntityID) {
    const workoutPlanExercise = new WorkoutPlanExercise(props, id)

    return workoutPlanExercise
  }
}
