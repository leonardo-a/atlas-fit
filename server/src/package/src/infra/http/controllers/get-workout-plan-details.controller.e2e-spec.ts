import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { Slug } from '@/domains/workout/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'
import { StudentFactory } from 'test/factories/make-student'
import { WorkoutPlanFactory } from 'test/factories/make-workout-plan'

describe('Get Workout Plan Details (E2E)', () => {
  let app: INestApplication
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

    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    workoutPlanFactory = moduleRef.get(WorkoutPlanFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /workout-plans/:workoutPlanId', async () => {
    const author = await personalTrainerFactory.makePrismaPersonalTrainer()

    const student = await studentFactory.makePrismaStudent()

    const workoutPlan = await workoutPlanFactory.makePrismaWorkoutPlan({
      authorId: author.id,
      studentId: student.id,
      title: 'My Workout',
      slug: Slug.createFromText('My Workout'),
    })

    const accessToken = jwt.sign({
      sub: author.id.toString(),
      role: author.role,
    })

    const workoutPlanId = workoutPlan.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/workout-plans/${workoutPlanId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        workoutPlan: expect.objectContaining({
          id: workoutPlanId,
          slug: 'my-workout',
        }),
      }),
    )
  })
})
