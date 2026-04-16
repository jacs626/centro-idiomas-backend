import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';

type Group = {
  id: number;
  name: string;
  courseId: number;
  teacherId: number;
  startDate: Date | string;
  endDate: Date | string;
  createdAt?: Date;
};

@Injectable()
export class GroupsService {
  private groups: Group[] = [];

  findAll() {
    return this.groups;
  }

  create(dto: CreateGroupDto) {
    const startDate =
      typeof dto.startDate === 'string'
        ? new Date(dto.startDate)
        : dto.startDate;
    const endDate =
      typeof dto.endDate === 'string' ? new Date(dto.endDate) : dto.endDate;

    const newGroup: Group = {
      id: Date.now(),
      name: dto.name,
      courseId: dto.courseId,
      teacherId: dto.teacherId,
      startDate,
      endDate,
      createdAt: new Date(),
    };

    this.groups.push(newGroup);
    return newGroup;
  }

  update(id: number, dto: UpdateGroupDto) {
    const index = this.groups.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    const existingGroup = this.groups[index];
    const updatedGroup = { ...existingGroup, ...dto };

    if (dto.startDate) {
      updatedGroup.startDate =
        typeof dto.startDate === 'string'
          ? new Date(dto.startDate)
          : dto.startDate;
    }
    if (dto.endDate) {
      updatedGroup.endDate =
        typeof dto.endDate === 'string' ? new Date(dto.endDate) : dto.endDate;
    }

    this.groups[index] = updatedGroup;
    return this.groups[index];
  }

  remove(id: number) {
    const index = this.groups.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    const deleted = this.groups.splice(index, 1);
    return deleted[0];
  }

  findByCourse(courseId: number) {
    return this.groups.filter((g) => g.courseId === courseId);
  }
}
