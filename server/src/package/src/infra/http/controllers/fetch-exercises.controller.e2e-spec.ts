import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'

describe('Fetch Exercises (E2E)', () => {
  let app: INestApplication
  let personalTrainerFactory: PersonalTrainerFactory
  let exerciseFactory: ExerciseFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ExerciseFactory, PersonalTrainerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    exerciseFactory = moduleRef.get(ExerciseFactory)
    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /exercises', async () => {
    const user = await personalTrainerFactory.makePrismaPersonalTrainer()

    await exerciseFactory.makePrismaExercise({
      name: 'Bench Press',
    })

    await exerciseFactory.makePrismaExercise({
      name: 'Squat',
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/exercises')
      .query({
        query: 'bench',
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        exercises: expect.arrayContaining([
          expect.objectContaining({
            name: 'Bench Press',
          }),
        ]),
      }),
    )
    expect(response.body.exercises).toHaveLength(1)
  })
})
