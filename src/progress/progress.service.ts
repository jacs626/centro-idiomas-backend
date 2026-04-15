import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto/update-progress.dto';
import { LanguageLevel } from './enums/language-level.enum';

type Progress = {
  id: number;
  userId: number;
  courseId: number;
  level: LanguageLevel;
  percentage: number;
};

@Injectable()
export class ProgressService {
  private progresses: Progress[] = [];

  findAll() {
    return this.progresses;
  }

  create(dto: CreateProgressDto) {
    const newProgress: Progress = {
      id: Date.now(),
      ...dto,
    };
    this.progresses.push(newProgress);
    return newProgress;
  }

  update(id: number, dto: UpdateProgressDto) {
    const index = this.progresses.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Progress with id ${id} not found`);
    }
    this.progresses[index] = { ...this.progresses[index], ...dto };
    return this.progresses[index];
  }

  remove(id: number) {
    const index = this.progresses.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Progress with id ${id} not found`);
    }
    return this.progresses.splice(index, 1)[0];
  }

  findByUser(userId: number) {
    return this.progresses.filter((p) => p.userId === userId);
  }

  findByCourse(courseId: number) {
    return this.progresses.filter((p) => p.courseId === courseId);
  }

  findByUserAndCourse(userId: number, courseId: number) {
    return this.progresses.find((p) => p.userId === userId && p.courseId === courseId);
  }
}