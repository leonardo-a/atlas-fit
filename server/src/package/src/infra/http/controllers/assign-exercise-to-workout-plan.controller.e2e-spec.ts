import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UserFactory } from 'test/factories/make-user'
import { WorkoutPlanFactory } from 'test/factories/make-workout-plan'
import { ExerciseFactory } from 'test/factories/make-exercise'

describe('Assign Exercise to Workout Plan (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let workoutPlanFactory: WorkoutPlanFactory
  let exerciseFactory: ExerciseFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, WorkoutPlanFactory, ExerciseFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    exerciseFactory = moduleRef.get(ExerciseFactory)
    workoutPlanFactory = moduleRef.get(WorkoutPlanFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /workout-plan/:workoutPlanId/exercises', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const workoutPlan = await workoutPlanFactory.makePrismaWorkoutPlan({
      ownerId: user.id,
    })
    const exercise = await exerciseFactory.makePrismaExercise({
      name: 'Bench Press',
    })

    const workoutPlanId = workoutPlan.id.toString()
    const exerciseId = exercise.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/workout-plan/${workoutPlanId}/exercises`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        exerciseId,
        repetitions: 10,
        sets: 4,
        weekDay: 1,
      })

    expect(response.statusCode).toBe(201)

    const workoutPlanExerciseOnDatabase =
      await prisma.workoutPlanExercise.findFirst({
        where: {
          exerciseId,
        },
      })

    expect(workoutPlanExerciseOnDatabase).toBeTruthy()
  })
})
