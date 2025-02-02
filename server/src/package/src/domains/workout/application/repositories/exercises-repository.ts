import { FilterParams } from '@/core/repositories/filter-params'
import { Exercise } from '../../enterprise/entities/exercise'

export abstract class ExercisesRepository {
  abstract findMany(params: FilterParams): Promise<Exercise[]>

  abstract findById(id: string): Promise<Exercise | null>

  abstract findBySlug(slug: string): Promise<Exercise | null>

  abstract create(exercise: Exercise): Promise<void>

  abstract save(exercise: Exercise): Promise<void>
}
