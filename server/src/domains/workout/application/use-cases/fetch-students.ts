import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'

interface FetchStudentsUseCaseRequest {
  page: number
  query: string
}

type FetchStudentsUseCaseResponse = Either<null, { students: Student[] }>

@Injectable()
export class FetchStudentsUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    page,
    query,
  }: FetchStudentsUseCaseRequest): Promise<FetchStudentsUseCaseResponse> {
    const students = await this.studentsRepository.findMany({
      page,
      query,
    })

    return right({
      students,
    })
  }
}
