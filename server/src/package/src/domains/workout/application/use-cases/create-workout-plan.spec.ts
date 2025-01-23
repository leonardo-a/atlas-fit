import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { CreateWorkoutPlanUseCase } from './create-workout-plan'

let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: CreateWorkoutPlanUseCase

describe('Create Workout Plan Use Case', () => {
  beforeEach(() => {
    inMemoryWorkoutPlanExercisesRepository =
      new InMemoryWorkoutPlanExercisesRepository()
    inMemoryWorkoutPlansRepository = new InMemoryWorkoutPlansRepository(
      inMemoryWorkoutPlanExercisesRepository,
    )

    sut = new CreateWorkoutPlanUseCase(inMemoryWorkoutPlansRepository)
  })

  it('should be able to create a workout plan', async () => {
    const response = await sut.execute({
      ownerId: 'user-1',
      title: 'My Workout Plan',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlansRepository.items).toHaveLength(1)
  })
})
