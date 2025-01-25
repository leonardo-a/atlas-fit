import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { makeStudent } from 'test/factories/make-student'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { WorkoutPlanWithDetails } from '../../enterprise/entities/value-objects/workout-plan-with-details'
import { GetWorkoutPlanDetailsUseCase } from './get-workout-plan-details'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: GetWorkoutPlanDetailsUseCase

describe('Get Workout Plan Details Use Case', () => {
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

    sut = new GetWorkoutPlanDetailsUseCase(inMemoryWorkoutPlansRepository)
  })

  it('should be able to a personal trainer get workout plan details', async () => {
    const personalTrainer = makePersonalTrainer()
    const student = makeStudent()

    const workoutPlan = makeWorkoutPlan({
      authorId: personalTrainer.id,
      studentId: student.id,
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryStudentsRepository.items.push(student)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const response = await sut.execute({
      slug: workoutPlan.slug.value,
      userId: personalTrainer.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.workoutPlan).toBeInstanceOf(WorkoutPlanWithDetails)
      expect(response.value.workoutPlan).toEqual(
        expect.objectContaining({
          id: workoutPlan.id,
        }),
      )
    }
  })

  it('should be able to astudent get workout plan details', async () => {
    const personalTrainer = makePersonalTrainer()
    const student = makeStudent()

    const workoutPlan = makeWorkoutPlan({
      authorId: personalTrainer.id,
      studentId: student.id,
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryStudentsRepository.items.push(student)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const response = await sut.execute({
      slug: workoutPlan.slug.value,
      userId: student.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.workoutPlan).toBeInstanceOf(WorkoutPlanWithDetails)
      expect(response.value.workoutPlan).toEqual(
        expect.objectContaining({
          id: workoutPlan.id,
        }),
      )
    }
  })

  it('should not be able to unauthorized user get workout plan details', async () => {
    const personalTrainer = makePersonalTrainer()
    const student = makeStudent()

    const workoutPlan = makeWorkoutPlan({
      authorId: personalTrainer.id,
      studentId: student.id,
    })

    inMemoryPersonalTrainersRepository.items.push(personalTrainer)
    inMemoryStudentsRepository.items.push(student)
    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    const response = await sut.execute({
      slug: workoutPlan.slug.value,
      userId: 'user-1',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to get non existent workout plan details', async () => {
    const response = await sut.execute({
      slug: 'invalid-workout-plan-slug',
      userId: 'user-1',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
