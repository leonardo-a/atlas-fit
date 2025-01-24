import { PersonalTrainersRepository } from '@/domains/workout/application/repositories/personal-trainers-repository'
import { PersonalTrainer } from '@/domains/workout/enterprise/entities/personal-trainer'

export class InMemoryPersonalTrainersRepository
  implements PersonalTrainersRepository
{
  public items: PersonalTrainer[] = []

  async findById(id: string): Promise<PersonalTrainer | null> {
    const personalTrainer = this.items.find((item) => item.id.toString() === id)

    if (!personalTrainer) {
      return null
    }

    return personalTrainer
  }

  async findByEmail(email: string): Promise<PersonalTrainer | null> {
    const personalTrainer = this.items.find((item) => item.email === email)

    if (!personalTrainer) {
      return null
    }

    return personalTrainer
  }

  async create(personalTrainer: PersonalTrainer): Promise<void> {
    this.items.push(personalTrainer)
  }
}
