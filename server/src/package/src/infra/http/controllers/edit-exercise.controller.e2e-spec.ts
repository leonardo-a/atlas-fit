import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'
import { ExerciseFactory } from 'test/factories/make-exercise'

describe('Create Exercise (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let personalTrainerFactory: PersonalTrainerFactory
  let exerciseFactory: ExerciseFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PersonalTrainerFactory, ExerciseFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    exerciseFactory = moduleRef.get(ExerciseFactory)

    await app.init()
  })

  test('[PUT] /exercises/:id', async () => {
    const user = await personalTrainerFactory.makePrismaPersonalTrainer()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      name: user.name,
      role: user.role,
    })

    const exercise = await exerciseFactory.makePrismaExercise({
      name: 'Flyer',
    })

    const exerciseId = exercise.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/exercises/${exerciseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Bench press',
        videoUrl: exercise.videoUrl,
        description: exercise.description,
      })

    expect(response.statusCode).toBe(204)

    const exerciseOnDatabase = await prisma.exercise.findFirst({
      where: {
        name: 'Bench press',
      },
    })

    expect(exerciseOnDatabase).toBeTruthy()
  })
})
