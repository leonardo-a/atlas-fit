import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PersonalTrainerProps {
  name: string
  email: string
  password: string
}

export class PersonalTrainer extends Entity<PersonalTrainerProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return 'PERSONAL_TRAINER'
  }

  static create(props: PersonalTrainerProps, id?: UniqueEntityID) {
    const personalTrainer = new PersonalTrainer(props, id)

    return personalTrainer
  }
}
