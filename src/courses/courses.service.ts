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

  async findOne(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
    });
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
