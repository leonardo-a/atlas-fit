import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { CreateWorkoutPlanUseCase } from './create-workout-plan'
import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: CreateWorkoutPlanUseCase

describe('Create Workout Plan Use Case', () => {
  beforeEach(() => {
    inMemoryPersonalTrainersRepository =
      new InMemoryPersonalTrainersRepository()
    inMemoryWorkoutPlanExercisesRepository =
      new InMemoryWorkoutPlanExercisesRepository()
    inMemoryWorkoutPlansRepository = new InMemoryWorkoutPlansRepository(
      inMemoryWorkoutPlanExercisesRepository,
    )

    sut = new CreateWorkoutPlanUseCase(
      inMemoryPersonalTrainersRepository,
      inMemoryWorkoutPlansRepository,
    )
  })

  it('should be able to create a workout plan', async () => {
    const personalTrainer = makePersonalTrainer()

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)

    const userId = personalTrainer.id.toString()

    const response = await sut.execute({
      userId,
      ownerId: 'user-1',
      title: 'My Workout Plan',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlansRepository.items).toHaveLength(1)
  })

  it('should not be able to a stundet create a workout plan', async () => {
    const response = await sut.execute({
      userId: 'user-1',
      ownerId: 'user-1',
      title: 'My Workout Plan',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})
