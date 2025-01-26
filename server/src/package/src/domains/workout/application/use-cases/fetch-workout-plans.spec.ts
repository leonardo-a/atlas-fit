import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { makeStudent } from 'test/factories/make-student'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { FetchWorkoutPlansUseCase } from './fetch-workout-plans'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: FetchWorkoutPlansUseCase

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

    sut = new FetchWorkoutPlansUseCase(inMemoryWorkoutPlansRepository)
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

  it('should be able to fetch paginated workout plans', async () => {
    const personalTrainer = makePersonalTrainer()
    const student = makeStudent()

    for (let i = 1; i <= 22; i++) {
      inMemoryWorkoutPlansRepository.items.push(
        makeWorkoutPlan({
          authorId: personalTrainer.id,
          studentId: student.id,
          title: `Workout Plan ${i}`,
        }),
      )
    }

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryStudentsRepository.items.push(student)

    const response = await sut.execute({
      page: 2,
      query: '',
      authorId: personalTrainer.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value?.workoutPlans).toHaveLength(2)
    expect(response.value?.workoutPlans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Workout Plan 21',
        }),
        expect.objectContaining({
          title: 'Workout Plan 22',
        }),
      ]),
    )
  })
})
