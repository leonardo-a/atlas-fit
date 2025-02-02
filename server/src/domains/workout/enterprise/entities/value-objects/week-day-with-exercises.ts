import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface WeekDayWithExercisesProps {
  weekDay: number
  exercises: {
    id: UniqueEntityID
    name: string
    sets: number
    repetitions: number
  }[]
}

export class WeekDayWithExercises extends ValueObject<WeekDayWithExercisesProps> {
  get weekDay() {
    return this.props.weekDay
  }

  get exercises() {
    return this.props.exercises
  }

  static create(props: WeekDayWithExercisesProps) {
    return new WeekDayWithExercises(props)
  }
}
