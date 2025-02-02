import { FilterParams } from '@/core/repositories/filter-params'
import { ExercisesRepository } from '@/domains/workout/application/repositories/exercises-repository'
import { Exercise } from '@/domains/workout/enterprise/entities/exercise'

export class InMemoryExercisesRepository implements ExercisesRepository {
  public items: Exercise[] = []

  async findMany({ page, query }: FilterParams): Promise<Exercise[]> {
    const exercises = this.items
      .filter((item) => {
        if (query) {
          return item.name.toLowerCase().includes(query.toLowerCase())
        }

        return true
      })
      .slice((page - 1) * 20, page * 20)

    return exercises
  }

  async findById(id: string): Promise<Exercise | null> {
    const exercise = this.items.find((item) => item.id.toString() === id)

    if (!exercise) {
      return null
    }

    return exercise
  }

  async findBySlug(slug: string): Promise<Exercise | null> {
    const exercise = this.items.find((item) => item.slug.value === slug)

    if (!exercise) {
      return null
    }

    return exercise
  }

  async create(exercise: Exercise): Promise<void> {
    this.items.push(exercise)
  }

  async save(exercise: Exercise): Promise<void> {
    const exerciseIndex = this.items.findIndex(
      (item) => item.id === exercise.id,
    )

    this.items[exerciseIndex] = exercise
  }
}
