import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name!: string;

  @IsNumber()
  courseId!: number;

  @IsNumber()
  teacherId!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
