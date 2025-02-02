import { Injectable } from '@nestjs/common'

import { StudentsRepository } from '@/domains/workout/application/repositories/students-repository'
import { Student } from '@/domains/workout/enterprise/entities/student'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'
import { FilterParams } from '@/core/repositories/filter-params'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'STUDENT',
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async findMany({ page, query }: FilterParams): Promise<Student[]> {
    const students = await this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            id: query,
          },
        ],
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return students.map(PrismaStudentMapper.toDomain)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
      data,
    })
  }
}
