import { makeExercise } from 'test/factories/make-exercise'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { AssignExerciseToWorkoutPlanUseCase } from './assign-exercise-to-workout-plan'
import { WorkoutPlanExerciseAlreadyExistsOnWeekDayError } from './errors/workout-plan-exercise-already-exists-on-week-day-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ExerciseLimitReachedError } from './errors/exercise-limit-reached-error'

let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let sut: AssignExerciseToWorkoutPlanUseCase

describe('Assign Exercise To Workout Plan Use Case', () => {
  beforeEach(() => {
    inMemoryExercisesRepository = new InMemoryExercisesRepository()
    inMemoryWorkoutPlanExercisesRepository =
      new InMemoryWorkoutPlanExercisesRepository()
    inMemoryWorkoutPlansRepository = new InMemoryWorkoutPlansRepository(
      inMemoryWorkoutPlanExercisesRepository,
    )

    sut = new AssignExerciseToWorkoutPlanUseCase(
      inMemoryWorkoutPlanExercisesRepository,
      inMemoryWorkoutPlansRepository,
      inMemoryExercisesRepository,
    )
  })

  it('should be able to assign an exercise to a workout plan', async () => {
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()
    const ownerId = workoutPlan.ownerId.toString()

    const response = await sut.execute({
      ownerId,
      exerciseId,
      workoutPlanId,
      repetitions: 12,
      sets: 4,
      weekDay: 1,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(1)
  })

  it('should be able to assign same exercise on different week days', async () => {
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()
    const ownerId = workoutPlan.ownerId.toString()

    inMemoryWorkoutPlanExercisesRepository.items.push(
      makeWorkoutPlanExercise({
        exerciseId: exercise.id,
        workoutPlanId: workoutPlan.id,
        repetitions: 12,
        sets: 4,
        weekDay: 1,
      }),
    )

    const response = await sut.execute({
      ownerId,
      exerciseId,
      workoutPlanId,
      repetitions: 12,
      sets: 4,
      weekDay: 5,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(2)
  })

  it('should not assign same exercise twice on the same week day', async () => {
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()
    const ownerId = workoutPlan.ownerId.toString()

    inMemoryWorkoutPlanExercisesRepository.items.push(
      makeWorkoutPlanExercise({
        exerciseId: exercise.id,
        workoutPlanId: workoutPlan.id,
        repetitions: 12,
        sets: 4,
        weekDay: 1,
      }),
    )

    const response = await sut.execute({
      ownerId,
      exerciseId,
      workoutPlanId,
      repetitions: 12,
      sets: 4,
      weekDay: 1,
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(
      WorkoutPlanExerciseAlreadyExistsOnWeekDayError,
    )
  })

  it('should not be able to a different user assign an exercise to a workout plan', async () => {
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()

    const response = await sut.execute({
      ownerId: 'invalid-owner-id',
      exerciseId,
      workoutPlanId,
      repetitions: 12,
      sets: 4,
      weekDay: 1,
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to exceed exercise limit per workout plan', async () => {
    const workoutPlan = makeWorkoutPlan()

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    for (let i = 0; i < 40; i++) {
      const exercise = makeExercise({
        name: `Exercise ${i}`,
      })

      inMemoryExercisesRepository.items.push(exercise)

      const workoutPlanExercise = makeWorkoutPlanExercise({
        exerciseId: exercise.id,
        workoutPlanId: workoutPlan.id,
      })

      inMemoryWorkoutPlanExercisesRepository.items.push(workoutPlanExercise)
    }
    const exercise = makeExercise({
      name: 'Bench press',
    })

    inMemoryExercisesRepository.items.push(exercise)

    const response = await sut.execute({
      ownerId: workoutPlan.ownerId.toString(),
      exerciseId: exercise.id.toString(),
      workoutPlanId: workoutPlan.id.toString(),
      repetitions: 12,
      sets: 4,
      weekDay: 1,
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ExerciseLimitReachedError)
  })
})
