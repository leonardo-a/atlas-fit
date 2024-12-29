import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { RemoveExerciseFromWorkoutPlanUseCase } from './remove-exercise-from-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'

let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let sut: RemoveExerciseFromWorkoutPlanUseCase

describe('Remove Exercise from Workout Plan Use Case', () => {
  beforeEach(() => {
    inMemoryWorkoutPlanExercisesRepository =
      new InMemoryWorkoutPlanExercisesRepository()
    inMemoryWorkoutPlansRepository = new InMemoryWorkoutPlansRepository(
      inMemoryWorkoutPlanExercisesRepository,
    )

    sut = new RemoveExerciseFromWorkoutPlanUseCase(
      inMemoryWorkoutPlanExercisesRepository,
      inMemoryWorkoutPlansRepository,
    )
  })

  it('should be able to remove an exercise from a workout plan', async () => {
    const workoutPlan = makeWorkoutPlan()
    const workoutPlanExercise = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
    })

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)
    inMemoryWorkoutPlanExercisesRepository.items.push(workoutPlanExercise)

    const ownerId = workoutPlan.ownerId.toString()
    const workoutPlanExerciseId = workoutPlanExercise.id.toString()

    const response = await sut.execute({
      ownerId,
      workoutPlanExerciseId,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(0)
  })

  it('should not be able to remove and exercise that doest exists on workout plan', async () => {
    const response = await sut.execute({
      ownerId: 'user-1',
      workoutPlanExerciseId: 'non-existent-exercise',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to a different user remove and exercise from a workot plan', async () => {
    const workoutPlan = makeWorkoutPlan()
    const workoutPlanExercise = makeWorkoutPlanExercise({
      workoutPlanId: workoutPlan.id,
    })

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)
    inMemoryWorkoutPlanExercisesRepository.items.push(workoutPlanExercise)

    const workoutPlanExerciseId = workoutPlanExercise.id.toString()

    const response = await sut.execute({
      ownerId: 'invalid-owner',
      workoutPlanExerciseId,
    })

    expect(response.isLeft()).toBeTruthy()
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(1)
  })
})
