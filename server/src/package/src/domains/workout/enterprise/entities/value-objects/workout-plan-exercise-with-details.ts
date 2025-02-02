import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface WorkoutPlanExerciseWithDetailsProps {
  workoutPlanExerciseId: UniqueEntityID
  exerciseId: UniqueEntityID
  name: string
  sets: number
  repetitions: number
  videoUrl?: string | null
}

export class WorkoutPlanExerciseWithDetails extends ValueObject<WorkoutPlanExerciseWithDetailsProps> {
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

  get videoUrl() {
    return this.props.videoUrl
  }

  static create(props: WorkoutPlanExerciseWithDetailsProps) {
    return new WorkoutPlanExerciseWithDetails(props)
  }
}
