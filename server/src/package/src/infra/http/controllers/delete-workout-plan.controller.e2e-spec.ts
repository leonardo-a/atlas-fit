import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'
import { StudentFactory } from 'test/factories/make-student'
import { WorkoutPlanFactory } from 'test/factories/make-workout-plan'

describe('Delete Workout Plan (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let personalTrainerFactory: PersonalTrainerFactory
  let studentFactory: StudentFactory
  let workoutPlanFactory: WorkoutPlanFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PersonalTrainerFactory, StudentFactory, WorkoutPlanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    workoutPlanFactory = moduleRef.get(WorkoutPlanFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /workout-plans/:workoutPlanId', async () => {
    const author = await personalTrainerFactory.makePrismaPersonalTrainer()

    const student = await studentFactory.makePrismaStudent()

    const workoutPlan = await workoutPlanFactory.makePrismaWorkoutPlan({
      authorId: author.id,
      studentId: student.id,
    })

    const accessToken = jwt.sign({
      sub: author.id.toString(),
      name: author.name,
      role: author.role,
    })

    const workoutPlanId = workoutPlan.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/workout-plans/${workoutPlanId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const workoutPlanOnDatabase = await prisma.workoutPlan.findUnique({
      where: {
        id: workoutPlanId,
      },
    })

    expect(workoutPlanOnDatabase).toBeNull()
  })
})
