import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from 'test/factories/make-student'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'

describe('Fetch Students (E2E)', () => {
  let app: INestApplication
  let personalTrainerFactory: PersonalTrainerFactory
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, PersonalTrainerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /students', async () => {
    const user = await personalTrainerFactory.makePrismaPersonalTrainer()

    await studentFactory.makePrismaStudent({
      name: 'John doe',
    })

    await studentFactory.makePrismaStudent({
      name: 'Jane doe',
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/students')
      .query({
        query: 'jane',
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        students: expect.arrayContaining([
          expect.objectContaining({
            name: 'Jane doe',
          }),
        ]),
      }),
    )
    expect(response.body.students).toHaveLength(1)
  })
})
