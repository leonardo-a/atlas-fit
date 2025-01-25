import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import {
  WorkoutPlansFilterParams,
  WorkoutPlansRepository,
} from '@/domains/workout/application/repositories/workout-plans-repository'
import { WorkoutPlanSummary } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-summary'
import { WorkoutPlanWithDetails } from '@/domains/workout/enterprise/entities/value-objects/workout-plan-with-details'
import { WorkoutPlan } from '@/domains/workout/enterprise/entities/workout-plan'
import { InMemoryPersonalTrainersRepository } from './in-memory-personal-trainers-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryWorkoutPlanExercisesRepository } from './in-memory-workout-plan-exercises-repository'

export class InMemoryWorkoutPlansRepository implements WorkoutPlansRepository {
  public items: WorkoutPlan[] = []

  constructor(
    private workoutPlanExercisesRepository: InMemoryWorkoutPlanExercisesRepository,
    private personalTrainersRepository: InMemoryPersonalTrainersRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findMany({
    page,
    query,
    studentId,
    authorId,
  }: WorkoutPlansFilterParams): Promise<WorkoutPlanSummary[]> {
    const workoutPlans = this.items
      .filter((item) => {
        if (query) {
          return item.title.toLowerCase().includes(query.toLowerCase())
        }

        return true
      })
      .filter((item) => {
        if (studentId) {
          return item.studentId.toString() === studentId
        }

        return true
      })
      .filter((item) => {
        if (authorId) {
          return item.authorId.toString() === authorId
        }

        return true
      })
      .slice((page - 1) * 20, page * 20)
      .map((item) => {
        const exercises = this.workoutPlanExercisesRepository.items.filter(
          (e) => e.workoutPlanId === item.id,
        ).length

        const author = this.personalTrainersRepository.items.find(
          (a) => a.id === item.authorId,
        )

        if (!author) {
          throw new ResourceNotFoundError()
        }

        return WorkoutPlanSummary.create({
          author: author.name,
          authorId: item.authorId,
          exercises,
          slug: item.slug,
          title: item.title,
          description: item.description,
        })
      })

    return workoutPlans
  }

  async findById(id: string): Promise<WorkoutPlan | null> {
    const workoutPlan = this.items.find((item) => item.id.toString() === id)

    if (!workoutPlan) {
      return null
    }

    return workoutPlan
  }

  async findBySlug(slug: string): Promise<WorkoutPlan | null> {
    const workoutPlan = this.items.find((item) => item.slug.value === slug)

    if (!workoutPlan) {
      return null
    }

    return workoutPlan
  }

  async findBySlugWithDetails(
    slug: string,
  ): Promise<WorkoutPlanWithDetails | null> {
    const workoutPlan = this.items.find((item) => item.slug.value === slug)

    if (!workoutPlan) {
      return null
    }

    const author = this.personalTrainersRepository.items.find((item) =>
      item.id.equals(workoutPlan.authorId),
    )

    if (!author) {
      throw new Error('Author not found.')
    }

    const student = this.studentsRepository.items.find((item) =>
      item.id.equals(workoutPlan.studentId),
    )

    if (!student) {
      throw new Error('Student not found.')
    }

    const workoutPlanWithDetails = WorkoutPlanWithDetails.create({
      id: workoutPlan.id,
      title: workoutPlan.title,
      slug: workoutPlan.slug,
      description: workoutPlan.description,
      authorId: workoutPlan.authorId,
      author: author.name,
      studentId: workoutPlan.studentId,
      student: student.name,
      createdAt: workoutPlan.createdAt,
      updatedAt: workoutPlan.updatedAt,
    })

    return workoutPlanWithDetails
  }

  async create(workoutPlan: WorkoutPlan): Promise<void> {
    this.items.push(workoutPlan)

    await this.workoutPlanExercisesRepository.createMany(
      workoutPlan.exercises.getItems(),
    )
  }

  async save(workoutPlan: WorkoutPlan): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === workoutPlan.id,
    )

    this.items[questionIndex] = workoutPlan
  }

  async delete(workoutPlan: WorkoutPlan): Promise<void> {
    const workoutPlanIndex = this.items.findIndex(
      (item) => item.id === workoutPlan.id,
    )

    this.workoutPlanExercisesRepository.deleteManyByWorkoutPlanId(
      workoutPlan.id.toString(),
    )

    this.items.splice(workoutPlanIndex, 1)
  }
}
