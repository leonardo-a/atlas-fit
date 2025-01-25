import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface WorkoutPlanExerciseWithNameProps {
  id: UniqueEntityID
  name: string
  sets: number
  repetitions: number
}

export class WorkoutPlanExerciseWithName extends ValueObject<WorkoutPlanExerciseWithNameProps> {
  get id() {
    return this.props.id
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
