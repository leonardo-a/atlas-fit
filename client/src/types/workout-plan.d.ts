export interface WorkoutPlanSummary {
  id: string
  author: string
  authorId: string
  exercises: number
  slug: string
  title: string
}

export interface WorkoutPlanWithDetails {
  id: string
  title: string
  slug: string
  description?: string | null
  authorId: string
  author: string
  studentId: string
  student: string
  createdAt: string
  updatedAt?: string | null
}