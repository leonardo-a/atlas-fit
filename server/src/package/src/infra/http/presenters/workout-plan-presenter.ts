import { WorkoutPlan } from '@/domains/workout/enterprise/entities/workout-plan'

export class WorkoutPlanPresenter {
  static toHTTP(workoutPlan: WorkoutPlan) {
    return {
      id: workoutPlan.id.toString(),
      title: workoutPlan.title,
      slug: workoutPlan.slug.value,
    }
  }
}
