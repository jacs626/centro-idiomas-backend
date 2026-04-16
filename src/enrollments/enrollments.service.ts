import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto/update-enrollment.dto';

type Enrollment = {
  id: number;
  userId: number;
  groupId: number;
  status: string;
  progress: number;
};

@Injectable()
export class EnrollmentsService {
  private enrollments: Enrollment[] = [];

  findAll() {
    return this.enrollments;
  }

  create(dto: CreateEnrollmentDto) {
    const newEnrollment: Enrollment = {
      id: Date.now(),
      ...dto,
    };
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  update(id: number, dto: UpdateEnrollmentDto) {
    const index = this.enrollments.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    this.enrollments[index] = { ...this.enrollments[index], ...dto };
    return this.enrollments[index];
  }

  remove(id: number) {
    const index = this.enrollments.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Enrollment with id ${id} not found`);
    }
    const deleted = this.enrollments.splice(index, 1);
    return deleted[0];
  }

  findByUser(userId: number) {
    return this.enrollments.filter((e) => e.userId === userId);
  }

  findByGroup(groupId: number) {
    return this.enrollments.filter((e) => e.groupId === groupId);
  }
}
