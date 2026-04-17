import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany();
  }

  async findEnrolledByUser(userId: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, status: { not: 'dropped' } },
      include: {
        group: {
          include: { course: true },
        },
      },
    });

    const courses = enrollments.map((e) => e.group.course);
    const uniqueCourses = courses.filter(
      (course, index, self) =>
        index === self.findIndex((c) => c.id === course.id),
    );

    return uniqueCourses;
  }

  async findOne(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
    });
  }

  async findOneWithAccess(id: number, user: { sub: number; role: string }) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    if (user.role === 'admin') {
      return course;
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId: user.sub,
        group: { courseId: id },
        status: { not: 'dropped' },
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return course;
  }

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    await this.prisma.course.delete({ where: { id } });
    return course;
  }
}
