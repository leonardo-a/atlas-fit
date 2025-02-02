import { Student } from '@/domains/workout/enterprise/entities/student'

export class StudentPresenter {
  static toHTTP(student: Student) {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
    }
  }
}
