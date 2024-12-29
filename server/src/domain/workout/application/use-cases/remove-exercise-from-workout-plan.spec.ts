import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { RemoveExerciseFromWorkoutPlanUseCase } from './remove-exercise-from-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: RemoveExerciseFromWorkoutPlanUseCase

describe('Remove Exercise from Workout Plan Use Case', () => {
  beforeEach(() => {
    inMemoryWorkoutPlanExercisesRepository =
      new InMemoryWorkoutPlanExercisesRepository()

    sut = new RemoveExerciseFromWorkoutPlanUseCase(
      inMemoryWorkoutPlanExercisesRepository,
    )
  })

  it('should be able to remove an exercise from a workout plan', async () => {
    const workoutPlanExercise = makeWorkoutPlanExercise()

    inMemoryWorkoutPlanExercisesRepository.items.push(workoutPlanExercise)

    const workoutPlanExerciseId = workoutPlanExercise.id.toString()

    const response = await sut.execute({
      workoutPlanExerciseId,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(0)
  })

  it('should not be able to remove and exercise that doest exists on workout plan', async () => {
    const response = await sut.execute({
      workoutPlanExerciseId: 'non-existent-exercise',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
