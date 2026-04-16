import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({
      include: { course: true, teacher: true },
    });
  }

  async create(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
      include: { course: true, teacher: true },
    });
  }

  async update(id: number, dto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    return this.prisma.group.update({
      where: { id },
      data: dto,
      include: { course: true, teacher: true },
    });
  }

  async remove(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }
    await this.prisma.group.delete({ where: { id } });
    return group;
  }

  async findByCourse(courseId: number) {
    return this.prisma.group.findMany({
      where: { courseId },
      include: { course: true, teacher: true },
    });
  }

  async findById(id: number) {
    return this.prisma.group.findMany({
      where: { id },
    });
  }
}
