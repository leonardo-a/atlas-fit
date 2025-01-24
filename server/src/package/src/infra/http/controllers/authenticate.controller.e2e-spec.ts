import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from 'test/factories/make-student'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'

describe('Authenticate (E2E)', () => {
  let app: INestApplication

  let studentFactory: StudentFactory
  let personalTrainerFactory: PersonalTrainerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PersonalTrainerFactory, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)

    await app.init()
  })

  test('[POST] /sessions (student)', async () => {
    await studentFactory.makePrismaStudent({
      email: 'janedoe@email.com',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'janedoe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  test('[POST] /sessions (personal trainer)', async () => {
    await personalTrainerFactory.makePrismaPersonalTrainer({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
