import { Injectable } from '@nestjs/common'

import { PersonalTrainersRepository } from '@/domains/workout/application/repositories/personal-trainers-repository'
import { PersonalTrainer } from '@/domains/workout/enterprise/entities/personal-trainer'
import { PrismaPersonalTrainerMapper } from '../mappers/prisma-personal-trainer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPersonalTrainersRepository
  implements PersonalTrainersRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<PersonalTrainer | null> {
    const personalTrainer = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'PERSONAL_TRAINER',
      },
    })

    if (!personalTrainer) {
      return null
    }

    return PrismaPersonalTrainerMapper.toDomain(personalTrainer)
  }

  async findByEmail(email: string): Promise<PersonalTrainer | null> {
    const personalTrainer = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'PERSONAL_TRAINER',
      },
    })

    if (!personalTrainer) {
      return null
    }

    return PrismaPersonalTrainerMapper.toDomain(personalTrainer)
  }

  async create(personalTrainer: PersonalTrainer): Promise<void> {
    const data = PrismaPersonalTrainerMapper.toPrisma(personalTrainer)

    await this.prisma.user.create({
      data,
    })
  }
}
