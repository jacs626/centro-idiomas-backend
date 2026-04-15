import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';

type Group = {
  id: number;
  name: string;
  courseId: number;
};

@Injectable()
export class GroupsService {
  private groups: Group[] = [];

  findAll() {
    return this.groups;
  }

  create(dto: CreateGroupDto) {
    const newGroup: Group = {
      id: Date.now(),
      ...dto,
    };

    this.groups.push(newGroup);
    return newGroup;
  }

  update(id: number, dto: UpdateGroupDto) {
    const index = this.groups.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    this.groups[index] = { ...this.groups[index], ...dto };
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
