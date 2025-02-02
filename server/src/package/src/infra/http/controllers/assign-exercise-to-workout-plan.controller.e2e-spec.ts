import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { PersonalTrainerFactory } from 'test/factories/make-personal-trainer'
import { StudentFactory } from 'test/factories/make-student'
import { WorkoutPlanFactory } from 'test/factories/make-workout-plan'

describe('Assign Exercise to Workout Plan (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let personalTrainerFactory: PersonalTrainerFactory
  let studentFactory: StudentFactory
  let workoutPlanFactory: WorkoutPlanFactory
  let exerciseFactory: ExerciseFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PersonalTrainerFactory,
        WorkoutPlanFactory,
        ExerciseFactory,
        StudentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    exerciseFactory = moduleRef.get(ExerciseFactory)
    workoutPlanFactory = moduleRef.get(WorkoutPlanFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /workout-plans/:workoutPlanId/exercises', async () => {
    const author = await personalTrainerFactory.makePrismaPersonalTrainer()
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({
      sub: author.id.toString(),
      name: author.name,
      role: author.role,
    })

    const workoutPlan = await workoutPlanFactory.makePrismaWorkoutPlan({
      authorId: author.id,
      studentId: student.id,
    })
    const exercise = await exerciseFactory.makePrismaExercise({
      name: 'Bench Press',
    })

    const workoutPlanId = workoutPlan.id.toString()
    const exerciseId = exercise.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/workout-plans/${workoutPlanId}/exercises`)
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
