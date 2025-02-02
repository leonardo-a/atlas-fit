import { Prisma, User as PrismaPersonalTrainer } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PersonalTrainer } from '@/domains/workout/enterprise/entities/personal-trainer'

export class PrismaPersonalTrainerMapper {
  static toDomain(raw: PrismaPersonalTrainer): PersonalTrainer {
    return PersonalTrainer.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    personalTrainer: PersonalTrainer,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: personalTrainer.id.toString(),
      email: personalTrainer.email,
      name: personalTrainer.name,
      password: personalTrainer.password,
      role: 'PERSONAL_TRAINER',
    }
  }
}
