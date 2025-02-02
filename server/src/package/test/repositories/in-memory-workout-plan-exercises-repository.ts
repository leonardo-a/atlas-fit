import { WorkoutPlanExercisesRepository } from '@/domains/workout/application/repositories/workout-plan-exercises-repository'
import { WorkoutPlanExerciseWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-exercise-with-details'
import { WorkoutPlanExercise } from '@/domains/workout/enterprise/entities/workout-plan-exercise'
import { InMemoryExercisesRepository } from './in-memory-exercises-repository'

export class InMemoryWorkoutPlanExercisesRepository
  implements WorkoutPlanExercisesRepository
{
  public items: WorkoutPlanExercise[] = []

  constructor(private exercisesRepository: InMemoryExercisesRepository) {}

  async findById(id: string): Promise<WorkoutPlanExercise | null> {
    const workoutPlanExercise = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!workoutPlanExercise) {
      return null
    }

    return workoutPlanExercise
  }

  async findManyByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutPlanExercise[]> {
    const workoutPlanExercises = this.items.filter(
      (item) => item.workoutPlanId.toString() === workoutPlanId,
    )

    return workoutPlanExercises
  }

  async findManyByWorkoutPlanWeekDay(
    workoutPlanId: string,
    weekDay: number,
  ): Promise<WorkoutPlanExerciseWithDetails[]> {
    const workoutPlanExercise = this.items.filter(
      (item) =>
        item.workoutPlanId.toString() === workoutPlanId &&
        item.weekDay === weekDay,
    )

    const workoutPlanExercises = workoutPlanExercise.map((e) => {
      const exercise = this.exercisesRepository.items.find(
        (item) => item.id === e.exerciseId,
      )

      if (!exercise) {
        throw new Error('Exercise not found.')
      }

      return WorkoutPlanExerciseWithDetails.create({
        workoutPlanExerciseId: e.id,
        exerciseId: exercise.id,
        name: exercise.name,
        repetitions: e.repetitions,
        sets: e.sets,
        videoUrl: exercise.videoUrl,
      })
    })

    return workoutPlanExercises
  }

  async create(workoutPlanExercise: WorkoutPlanExercise): Promise<void> {
    this.items.push(workoutPlanExercise)
  }

  async createMany(workoutPlanExercises: WorkoutPlanExercise[]): Promise<void> {
    this.items.push(...workoutPlanExercises)
  }

  async delete(workoutPlanExercise: WorkoutPlanExercise): Promise<void> {
    const workoutPlanExerciseIndex = this.items.findIndex(
      (item) => item.id === workoutPlanExercise.id,
    )

    this.items.splice(workoutPlanExerciseIndex, 1)
  }

  async deleteManyByWorkoutPlanId(workoutPlanId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.workoutPlanId.toString() !== workoutPlanId,
    )
  }
}
