import { makePersonalTrainer } from 'test/factories/make-personal-trainer'
import { makeWorkoutPlan } from 'test/factories/make-workout-plan'
import { makeWorkoutPlanExercise } from 'test/factories/make-workout-plan-exercise'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryPersonalTrainersRepository } from 'test/repositories/in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from 'test/repositories/in-memory-workout-plan-exercises-repository'
import { InMemoryWorkoutPlansRepository } from 'test/repositories/in-memory-workout-plans-repository'
import { DeleteWorkoutPlanUseCase } from './delete-workout-plan'

let inMemoryPersonalTrainersRepository: InMemoryPersonalTrainersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryExercisesRepository: InMemoryExercisesRepository
let inMemoryWorkoutPlansRepository: InMemoryWorkoutPlansRepository
let inMemoryWorkoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository
let sut: DeleteWorkoutPlanUseCase

describe('Delete Workout Plan Use Case', () => {
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

    sut = new DeleteWorkoutPlanUseCase(inMemoryWorkoutPlansRepository)
  })

  it('should be able to delete a workout plan', async () => {
    const personalTrainer = makePersonalTrainer()

    const workoutPlan = makeWorkoutPlan({
      authorId: personalTrainer.id,
    })

    inMemoryWorkoutPlansRepository.items.push(workoutPlan)

    inMemoryWorkoutPlanExercisesRepository.items.push(
      makeWorkoutPlanExercise({
        workoutPlanId: workoutPlan.id,
      }),
      makeWorkoutPlanExercise({
        workoutPlanId: workoutPlan.id,
      }),
    )

    const authorId = workoutPlan.authorId.toString()
    const workoutPlanId = workoutPlan.id.toString()

    const response = await sut.execute({
      authorId,
      workoutPlanId,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryWorkoutPlansRepository.items).toHaveLength(0)
    expect(inMemoryWorkoutPlanExercisesRepository.items).toHaveLength(0)
  })
})
