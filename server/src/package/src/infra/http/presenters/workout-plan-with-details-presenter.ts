import { WorkoutPlanWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-with-details'

export class WorkoutPlanWithDetailsPresenter {
  static toHTTP(workoutPlanWithDetails: WorkoutPlanWithDetails) {
    return {
      id: workoutPlanWithDetails.id.toString(),
      title: workoutPlanWithDetails.title,
      slug: workoutPlanWithDetails.slug.value,
      description: workoutPlanWithDetails.description,
      author: workoutPlanWithDetails.author,
      student: workoutPlanWithDetails.student,
      createdAt: workoutPlanWithDetails.createdAt,
      updatedAt: workoutPlanWithDetails.updatedAt,
    }
  }
}
