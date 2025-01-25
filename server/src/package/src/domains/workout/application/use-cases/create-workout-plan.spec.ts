import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { CreateWorkoutPlanUseCase } from './create-workout-plan'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: CreateWorkoutPlanUseCase

describe('Create Workout Plan Use Case', () => {
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

    sut = new CreateWorkoutPlanUseCase(
      inMemoryPersonalTrainersRepository,
      inMemoryWorkoutPlansRepository,
    )
  })

  it('should be able to create a workout plan', async () => {
    const personalTrainer = makePersonalTrainer()

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)

    const authorId = personalTrainer.id.toString()

    const response = await sut.execute({
      authorId,
      studentId: 'user-1',
      title: 'My Workout Plan',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlansRepository.items).toHaveLength(1)
  })

  it('should not be able to a stundet create a workout plan', async () => {
    const response = await sut.execute({
      authorId: 'user-1',
      studentId: 'user-1',
      title: 'My Workout Plan',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})
