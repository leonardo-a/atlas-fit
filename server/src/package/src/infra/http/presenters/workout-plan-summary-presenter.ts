import { WorkoutPlanSummary } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-summary'

export class WorkoutPlanSummaryPresenter {
  static toHTTP(workoutPlanSummary: WorkoutPlanSummary) {
    return {
      id: workoutPlanSummary.id.toString(),
      slug: workoutPlanSummary.slug.value,
      title: workoutPlanSummary.title,
      student: workoutPlanSummary.student,
      author: workoutPlanSummary.author,
      authorId: workoutPlanSummary.authorId.toString(),
      exercises: workoutPlanSummary.exercises,
    }
  }
}
