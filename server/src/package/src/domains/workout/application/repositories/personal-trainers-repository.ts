import { PersonalTrainer } from '../../enterprise/entities/personal-trainer'

export abstract class PersonalTrainersRepository {
  abstract findByEmail(email: string): Promise<PersonalTrainer | null>

  abstract findById(id: string): Promise<PersonalTrainer | null>

  abstract create(personalTrainer: PersonalTrainer): Promise<void>
}
