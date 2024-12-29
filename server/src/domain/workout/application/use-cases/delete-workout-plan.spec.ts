import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { DeleteWorkoutPlanUseCase } from './delete-workout-plan'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'

let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: DeleteWorkoutPlanUseCase

describe('Delete Workout Plan Use Case', () => {
  beforeEach(() => {
    inMemoryWorkoutPlanExercisesRepository =
      new InMemoryWorkoutPlanExercisesRepository()
    inMemoryWorkoutPlansRepository = new InMemoryWorkoutPlansRepository(
      inMemoryWorkoutPlanExercisesRepository,
    )

    sut = new DeleteWorkoutPlanUseCase(inMemoryWorkoutPlansRepository)
  })

  it('should be able to delete a workout plan', async () => {
    const workoutPlan = makeWorkoutPlan()

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    inMemoryWorkoutPlanExercisesRepository.items.push(
      makeWorkoutPlanExercise({
        workoutPlanId: workoutPlan.id,
      }),
      makeWorkoutPlanExercise({
        workoutPlanId: workoutPlan.id,
      }),
    )

    const ownerId = workoutPlan.ownerId.toString()
    const workoutPlanId = workoutPlan.id.toString()

    const response = await sut.execute({
      ownerId,
      workoutPlanId,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlansRepository.items).toHaveLength(0)
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(0)
  })
})
