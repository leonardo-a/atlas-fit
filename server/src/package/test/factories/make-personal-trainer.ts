import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  PersonalTrainer,
  PersonalTrainerProps,
} from '@/domains/workout/enterprise/entities/personal-trainer'
import { PrismaPersonalTrainerMapper } from '@/infra/database/prisma/mappers/prisma-personal-trainer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makePersonalTrainer(
  override: Partial<PersonalTrainerProps> = {},
  id?: UniqueEntityID,
) {
  const personalTrainer = PersonalTrainer.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return personalTrainer
}

@Injectable()
export class PersonalTrainerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPersonalTrainer(
    data: Partial<PersonalTrainerProps> = {},
  ): Promise<PersonalTrainer> {
    const personalTrainer = makePersonalTrainer(data)

    await this.prisma.user.create({
      data: PrismaPersonalTrainerMapper.toPrisma(personalTrainer),
    })

    return personalTrainer
  }
}
