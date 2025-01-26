import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'
import { StudentFactory } from 'test/factories/make-student'
import { WorkoutPlanFactory } from 'test/factories/make-workout-plan'
import { WorkoutPlanExerciseFactory } from 'test/factories/make-workout-plan-exercise'

describe('Fetch Week Day Workout Plan Exercises (E2E)', () => {
  let app: INestApplication
  let personalTrainerFactory: PersonalTrainerFactory
  let studentFactory: StudentFactory
  let workoutPlanFactory: WorkoutPlanFactory
  let workoutPlanExerciseFactory: WorkoutPlanExerciseFactory
  let exerciseFactory: ExerciseFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PersonalTrainerFactory,
        StudentFactory,
        ExerciseFactory,
        WorkoutPlanFactory,
        WorkoutPlanExerciseFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    exerciseFactory = moduleRef.get(ExerciseFactory)
    workoutPlanFactory = moduleRef.get(WorkoutPlanFactory)
    workoutPlanExerciseFactory = moduleRef.get(WorkoutPlanExerciseFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /workout-plans/:workoutPlanId/exercises', async () => {
    const author = await personalTrainerFactory.makePrismaPersonalTrainer()
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({
      sub: author.id.toString(),
      role: author.role,
    })

    const workoutPlan = await workoutPlanFactory.makePrismaWorkoutPlan({
      authorId: author.id,
      studentId: student.id,
    })

    const exercise1 = await exerciseFactory.makePrismaExercise({
      name: 'Bench Press',
    })

    const exercise2 = await exerciseFactory.makePrismaExercise({
      name: 'Squat',
    })

    await workoutPlanExerciseFactory.makePrismaWorkoutPlanExercise({
      exerciseId: exercise1.id,
      workoutPlanId: workoutPlan.id,
      weekDay: 1,
    })

    await workoutPlanExerciseFactory.makePrismaWorkoutPlanExercise({
      exerciseId: exercise2.id,
      workoutPlanId: workoutPlan.id,
      weekDay: 2,
    })

    const workoutPlanId = workoutPlan.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/workout-plans/${workoutPlanId}/exercises`)
      .query({
        weekDay: 2,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        weekDayExercises: expect.arrayContaining([
          expect.objectContaining({
            name: 'Squat',
          }),
        ]),
      }),
    )
    expect(response.body.weekDayExercises).toHaveLength(1)
  })
})
