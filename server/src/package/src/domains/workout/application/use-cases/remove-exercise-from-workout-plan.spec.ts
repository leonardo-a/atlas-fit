import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { RemoveExerciseFromWorkoutPlanUseCase } from './remove-exercise-from-workout-plan'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: RemoveExerciseFromWorkoutPlanUseCase

describe('Remove Exercise From Workout Plan Use Case', () => {
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

    sut = new RemoveExerciseFromWorkoutPlanUseCase(
      inMemoryWorkoutPlanExercisesRepository,
      inMemoryWorkoutPlansRepository,
    )
  })

  it('should be able to remove an exercise from a workout plan', async () => {
    const personalTrainer = makePersonalTrainer()
    const workoutPlan = makeWorkoutPlan({
      authorId: personalTrainer.id,
    })
    const workoutPlanExercise = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)
    inMemoryWorkoutPlanExercisesRepository.items.push(workoutPlanExercise)

    const authorId = workoutPlan.authorId.toString()
    const workoutPlanExerciseId = workoutPlanExercise.id.toString()

    const response = await sut.execute({
      authorId,
      workoutPlanExerciseId,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(0)
  })

  it('should not be able to remove and exercise that doest exists on workout plan', async () => {
    const personalTrainer = makePersonalTrainer()

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)

    const response = await sut.execute({
      authorId: personalTrainer.id.toString(),
      workoutPlanExerciseId: 'non-existent-exercise',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to a different author remove an exercise from a workot plan', async () => {
    const workoutPlan = makeWorkoutPlan()
    const workoutPlanExercise = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
    })

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)
    inMemoryWorkoutPlanExercisesRepository.items.push(workoutPlanExercise)

    const workoutPlanExerciseId = workoutPlanExercise.id.toString()

    const response = await sut.execute({
      authorId: 'invalid-owner',
      workoutPlanExerciseId,
    })

    expect(response.isLeft()).toBeTruthy()
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(1)
  })
})
