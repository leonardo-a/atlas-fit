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

describe('Fetch Workout Plans (E2E)', () => {
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

  test('[GET] /workout-plans', async () => {
    const author = await personalTrainerFactory.makePrismaPersonalTrainer()

    const student = await studentFactory.makePrismaStudent()

    await workoutPlanFactory.makePrismaWorkoutPlan({
      authorId: author.id,
      studentId: student.id,
      title: 'My Workout',
      slug: Slug.createFromText('My Workout'),
    })

    await workoutPlanFactory.makePrismaWorkoutPlan({
      authorId: author.id,
      studentId: student.id,
      title: 'Another Workout',
      slug: Slug.createFromText('Another Workout'),
    })

    const accessToken = jwt.sign({
      sub: author.id.toString(),
      role: author.role,
    })

    const response = await request(app.getHttpServer())
      .get('/workout-plans')
      .query({
        query: 'my',
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        workoutPlans: expect.arrayContaining([
          expect.objectContaining({
            slug: 'my-workout',
          }),
        ]),
      }),
    )
    expect(response.body.workoutPlans).toHaveLength(1)
  })
})
