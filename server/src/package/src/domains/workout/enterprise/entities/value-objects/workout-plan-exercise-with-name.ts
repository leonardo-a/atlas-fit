import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface WorkoutPlanExerciseWithNameProps {
  workoutPlanExerciseId: UniqueEntityID
  exerciseId: UniqueEntityID
  name: string
  sets: number
  repetitions: number
}

export class WorkoutPlanExerciseWithName extends ValueObject<WorkoutPlanExerciseWithNameProps> {
  get workoutPlanExerciseId() {
    return this.props.workoutPlanExerciseId
  }

  get exerciseId() {
    return this.props.exerciseId
  }

  get name() {
    return this.props.name
  }

  get sets() {
    return this.props.sets
  }

  get repetitions() {
    return this.props.repetitions
  }

  static create(props: WorkoutPlanExerciseWithNameProps) {
    return new WorkoutPlanExerciseWithName(props)
  }
}
