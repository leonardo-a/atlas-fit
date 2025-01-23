import { WorkoutPlan } from '../../enterprise/entities/workout-plan'

export abstract class WorkoutPlansRepository {
  abstract findById(id: string): Promise<WorkoutPlan | null>

  abstract findBySlug(slug: string): Promise<WorkoutPlan | null>

  abstract create(workoutPlan: WorkoutPlan): Promise<void>

  abstract save(workoutPlan: WorkoutPlan): Promise<void>

  abstract delete(workoutPlan: WorkoutPlan): Promise<void>
}
