import { FilterParams } from '@/core/repositories/filter-params'
import { StudentsRepository } from '@/domains/workout/application/repositories/students-repository'
import { Student } from '@/domains/workout/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async findMany({ page, query }: FilterParams): Promise<Student[]> {
    const students = this.items
      .filter((item) => {
        if (query) {
          return (
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.email.toLowerCase().includes(query.toLowerCase()) ||
            item.id.toString() === query
          )
        }

        return true
      })
      .slice((page - 1) * 20, page * 20)

    return students
  }

  async create(student: Student): Promise<void> {
    this.items.push(student)
  }
}
