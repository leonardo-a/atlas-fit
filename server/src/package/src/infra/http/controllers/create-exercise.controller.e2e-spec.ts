import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'

describe('Create Exercise (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let personalTrainerFactory: PersonalTrainerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PersonalTrainerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /exercises', async () => {
    const user = await personalTrainerFactory.makePrismaPersonalTrainer()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      name: user.name,
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .post('/exercises')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Bench press',
      })

    expect(response.statusCode).toBe(201)

    const exerciseOnDatabase = await prisma.exercise.findFirst({
      where: {
        name: 'Bench press',
      },
    })

    expect(exerciseOnDatabase).toBeTruthy()
  })
})
