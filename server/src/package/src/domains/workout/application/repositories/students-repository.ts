import { FilterParams } from '@/core/repositories/filter-params'
import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
  abstract findByEmail(email: string): Promise<Student | null>

  abstract create(student: Student): Promise<void>

  abstract findMany(filter: FilterParams): Promise<Student[]>
}
