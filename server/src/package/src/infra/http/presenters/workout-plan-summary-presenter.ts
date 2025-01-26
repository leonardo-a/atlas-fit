import { WorkoutPlanSummary } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-summary'

export class WorkoutPlanSummaryPresenter {
  static toHTTP(workoutPlanSummary: WorkoutPlanSummary) {
    return {
      slug: workoutPlanSummary.slug.value,
      title: workoutPlanSummary.title,
      author: workoutPlanSummary.author,
      authorId: workoutPlanSummary.authorId.toString(),
      exercises: workoutPlanSummary.exercises,
    }
  }
}
