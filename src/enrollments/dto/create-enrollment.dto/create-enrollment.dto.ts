import { IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  groupId!: number;

  @IsNumber()
  progress!: number;

  @IsIn(['active', 'dropped', 'completed'])
  status!: 'active' | 'dropped' | 'completed';
}
