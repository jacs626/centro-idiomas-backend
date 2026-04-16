import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async create(dto: CreateEnrollmentDto) {
    return this.prisma.enrollment.create({
      data: {
        ...dto,
        progress: 0,
        status: 'active',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async update(id: number, dto: UpdateEnrollmentDto) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    return this.prisma.enrollment.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async remove(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    await this.prisma.enrollment.delete({ where: { id } });
    return enrollment;
  }

  async findByUser(userId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async findByGroup(groupId: number) {
    return this.prisma.enrollment.findMany({
      where: { groupId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }

  async findByUserAndGroup(userId: number, groupId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId, groupId },
    });
  }

  async findById(id: number) {
    return this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true, courseId: true } },
      },
    });
  }
}
