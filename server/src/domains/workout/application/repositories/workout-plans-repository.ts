import { FilterParams } from '@/core/repositories/filter-params'
import { WorkoutPlanSummary } from '../../enterprise/entities/value-objects/workout-plan-summary'
import { WorkoutPlanWithDetails } from '../../enterprise/entities/value-objects/workout-plan-with-details'
import { WorkoutPlan } from '../../enterprise/entities/workout-plan'

export interface WorkoutPlansFilterParams extends FilterParams {
  studentId?: string
  authorId?: string
}

export abstract class WorkoutPlansRepository {
  abstract findMany(
    filter: WorkoutPlansFilterParams,
  ): Promise<WorkoutPlanSummary[]>

  abstract findById(id: string): Promise<WorkoutPlan | null>

  abstract findBySlug(slug: string): Promise<WorkoutPlan | null>

  abstract findBySlugWithDetails(
    slug: string,
  ): Promise<WorkoutPlanWithDetails | null>

  abstract findByIdWithDetails(
    id: string,
  ): Promise<WorkoutPlanWithDetails | null>

  abstract create(workoutPlan: WorkoutPlan): Promise<void>

  abstract save(workoutPlan: WorkoutPlan): Promise<void>

  abstract delete(workoutPlan: WorkoutPlan): Promise<void>
}
