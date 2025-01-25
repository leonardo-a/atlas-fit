import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { FetchWeekDayWorkoutPlanExercisesUseCase } from './fetch-week-day-workout-plan-exercises'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { makeExercise } from 'test/factories/make-exercise'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: FetchWeekDayWorkoutPlanExercisesUseCase

describe('Fetch Week Day Workout Plan Exercises Use Case', () => {
  beforeEach(() => {
    inMemoryPersonalTrainersRepository =
      new InMemoryPersonalTrainersRepository()

    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryExercisesRepository = new InMemoryExercisesRepository()

    inMemoryWorkoutPlanExercisesRepository =
      new InMemoryWorkoutPlanExercisesRepository(inMemoryExercisesRepository)

    inMemoryWorkoutPlansRepository = new InMemoryWorkoutPlansRepository(
      inMemoryWorkoutPlanExercisesRepository,
      inMemoryPersonalTrainersRepository,
      inMemoryStudentsRepository,
    )

    sut = new FetchWeekDayWorkoutPlanExercisesUseCase(
      inMemoryWorkoutPlansRepository,
      inMemoryWorkoutPlanExercisesRepository,
    )
  })

  it('should be able to a student fetch workout plan exercises by week day', async () => {
    const exercise1 = makeExercise({
      name: 'Bench press',
    })
    const exercise2 = makeExercise()

    const workoutPlan = makeWorkoutPlan()

    const workoutPlanExercise1 = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
      exerciseId: exercise1.id,
      weekDay: 2,
    })
    const workoutPlanExercise2 = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
      exerciseId: exercise2.id,
      weekDay: 4,
    })

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)
    inMemoryExercisesRepository.items.push(exercise1, exercise2)
    inMemoryWorkoutPlanExercisesRepository.items.push(
      workoutPlanExercise1,
      workoutPlanExercise2,
    )

    const userId = workoutPlan.studentId.toString()
    const workoutPlanId = workoutPlan.id.toString()

    const response = await sut.execute({
      userId,
      weekDay: 2,
      workoutPlanId,
    })

    expect(response.isRight()).toBeTruthy()

    if (response.isRight()) {
      expect(response.value.weekDayExercises).toHaveLength(1)
      expect(response.value.weekDayExercises[0]).toEqual(
        expect.objectContaining({
          name: 'Bench press',
        }),
      )
    }
  })

  it('should be able to a personal trainer fetch workout plan exercises by week day', async () => {
    const exercise1 = makeExercise({
      name: 'Bench press',
    })
    const exercise2 = makeExercise()

    const workoutPlan = makeWorkoutPlan()

    const workoutPlanExercise1 = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
      exerciseId: exercise1.id,
      weekDay: 2,
    })
    const workoutPlanExercise2 = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
      exerciseId: exercise2.id,
      weekDay: 4,
    })

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)
    inMemoryExercisesRepository.items.push(exercise1, exercise2)
    inMemoryWorkoutPlanExercisesRepository.items.push(
      workoutPlanExercise1,
      workoutPlanExercise2,
    )

    const userId = workoutPlan.authorId.toString()
    const workoutPlanId = workoutPlan.id.toString()

    const response = await sut.execute({
      userId,
      weekDay: 2,
      workoutPlanId,
    })

    expect(response.isRight()).toBeTruthy()

    if (response.isRight()) {
      expect(response.value.weekDayExercises).toHaveLength(1)
      expect(response.value.weekDayExercises[0]).toEqual(
        expect.objectContaining({
          name: 'Bench press',
        }),
      )
    }
  })

  it('should not be able to fetch exercises from non existing workout plan', async () => {
    const response = await sut.execute({
      userId: 'user-1',
      weekDay: 2,
      workoutPlanId: 'invalid-workout-plan-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to a unauthorized user fetch exercises', async () => {
    const workoutPlan = makeWorkoutPlan()

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const workoutPlanId = workoutPlan.id.toString()

    const response = await sut.execute({
      userId: 'unauthorized-user',
      weekDay: 2,
      workoutPlanId,
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})
