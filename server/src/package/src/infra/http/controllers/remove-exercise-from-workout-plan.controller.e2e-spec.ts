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
import { WorkoutPlanExerciseFactory } from 'test/factories/make-workout-plan-exercise'

describe('Remove Exercise from Workout Plan (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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

    prisma = moduleRef.get(PrismaService)
    personalTrainerFactory = moduleRef.get(PersonalTrainerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    exerciseFactory = moduleRef.get(ExerciseFactory)
    workoutPlanFactory = moduleRef.get(WorkoutPlanFactory)
    workoutPlanExerciseFactory = moduleRef.get(WorkoutPlanExerciseFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /workout-plans/exercises/:workoutPlanExerciseId', async () => {
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

    const workoutPlanExercise =
      await workoutPlanExerciseFactory.makePrismaWorkoutPlanExercise({
        exerciseId: exercise.id,
        workoutPlanId: workoutPlan.id,
      })

    const workoutPlanExerciseId = workoutPlanExercise.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/workout-plans/exercises/${workoutPlanExerciseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const workoutPlanExerciseOnDatabase =
      await prisma.workoutPlanExercise.findUnique({
        where: {
          id: workoutPlanExerciseId,
        },
      })

    expect(workoutPlanExerciseOnDatabase).toBeNull()
  })
})
