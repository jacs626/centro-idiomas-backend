import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';

type Course = {
  id: number;
  name: string;
  level: string;
  description?: string;
  createdAt?: Date;
};

@Injectable()
export class CoursesService {
  private courses: Course[] = [];

  findAll() {
    return this.courses;
  }

  create(dto: CreateCourseDto) {
    const newCourse: Course = {
      id: Date.now(),
      ...dto,
      createdAt: new Date(),
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  update(id: number, dto: UpdateCourseDto) {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    this.courses[index] = { ...this.courses[index], ...dto };
    return this.courses[index];
  }

  remove(id: number) {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    const deleted = this.courses.splice(index, 1);
    return deleted[0];
  }
}
