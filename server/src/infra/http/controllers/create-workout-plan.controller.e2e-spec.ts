import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'
import { StudentFactory } from 'test/factories/make-student'

describe('Create Workout Plan (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let personalTrainerFactory: PersonalTrainerFactory
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PersonalTrainerFactory, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /workout-plans', async () => {
    const user = await personalTrainerFactory.makePrismaPersonalTrainer()

    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      name: user.name,
      role: user.role,
    })

    const studentId = student.id.toString()

    const response = await request(app.getHttpServer())
      .post('/workout-plans')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        studentId,
        title: 'My Workout',
      })

    expect(response.statusCode).toBe(201)

    const workoutPlanOnDatabase = await prisma.workoutPlan.findFirst({
      where: {
        title: 'My Workout',
      },
    })

    expect(workoutPlanOnDatabase).toBeTruthy()
    expect(workoutPlanOnDatabase?.studentId).toEqual(studentId)
  })
})
