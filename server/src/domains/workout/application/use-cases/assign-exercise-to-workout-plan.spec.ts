import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeExercise } from 'test/factories/make-exercise'
import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { AssignExerciseToWorkoutPlanUseCase } from './assign-exercise-to-workout-plan'
import { ExerciseLimitReachedError } from './errors/exercise-limit-reached-error'
import { WorkoutPlanExerciseAlreadyExistsOnWeekDayError } from './errors/workout-plan-exercise-already-exists-on-week-day-error'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let sut: AssignExerciseToWorkoutPlanUseCase

describe('Assign Exercise To Workout Plan Use Case', () => {
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

    sut = new AssignExerciseToWorkoutPlanUseCase(
      inMemoryPersonalTrainersRepository,
      inMemoryWorkoutPlanExercisesRepository,
      inMemoryWorkoutPlansRepository,
      inMemoryExercisesRepository,
    )
  })

  it('should be able to assign an exercise to a workout plan', async () => {
    const personalTrainer = makePersonalTrainer()
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()
    const userId = personalTrainer.id.toString()

    const response = await sut.execute({
      userId,
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
    const personalTrainer = makePersonalTrainer()
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()
    const userId = personalTrainer.id.toString()

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
      userId,
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
    const personalTrainer = makePersonalTrainer()
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()
    const userId = personalTrainer.id.toString()

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
      userId,
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

  it('should not be able to a student assign an exercise to a workout plan', async () => {
    const workoutPlan = makeWorkoutPlan()
    const exercise = makeExercise({
      name: 'Bench Press',
    })

    inMemoryExercisesRepository.items.push(exercise)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const exerciseId = exercise.id.toString()
    const workoutPlanId = workoutPlan.id.toString()

    const response = await sut.execute({
      userId: 'invalid-personal-trainer-id',
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
    const personalTrainer = makePersonalTrainer()

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)
    inMemoryPersonalTrainersRepository.items.push(personalTrainer)

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

    const userId = personalTrainer.id.toString()

    const response = await sut.execute({
      userId,
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
