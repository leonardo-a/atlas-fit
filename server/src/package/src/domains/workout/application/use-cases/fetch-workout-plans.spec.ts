import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { FetchWotkoutPlansUseCase } from './fetch-workout-plans'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: FetchWotkoutPlansUseCase

describe('Fetch Workout Plans Use Case', () => {
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

    sut = new FetchWotkoutPlansUseCase(inMemoryWorkoutPlansRepository)
  })

  it('should be able to fetch students workout plans', async () => {
    const personalTrainer = makePersonalTrainer()

    const workoutPlan1 = makeWorkoutPlan({
      authorId: personalTrainer.id,
    })

    const workoutPlan2 = makeWorkoutPlan({
      authorId: personalTrainer.id,
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan1, workoutPlan2)

    const response = await sut.execute({
      page: 1,
      query: '',
      studentId: workoutPlan1.studentId.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value?.workoutPlans).toHaveLength(1)
    expect(response.value?.workoutPlans[0]).toEqual(
      expect.objectContaining({
        slug: workoutPlan1.slug,
      }),
    )
  })

  it('should be able to fetch personal trainer workout plans', async () => {
    const personalTrainer = makePersonalTrainer()

    const workoutPlan1 = makeWorkoutPlan({
      authorId: personalTrainer.id,
    })

    const workoutPlan2 = makeWorkoutPlan()

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan1, workoutPlan2)

    const response = await sut.execute({
      page: 1,
      query: '',
      authorId: workoutPlan1.authorId.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value?.workoutPlans).toHaveLength(1)
    expect(response.value?.workoutPlans[0]).toEqual(
      expect.objectContaining({
        slug: workoutPlan1.slug,
      }),
    )
  })
})
