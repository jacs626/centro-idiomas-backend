import { IsNumber, IsDateString, IsIn } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  enrollmentId!: number;

  @IsDateString()
  date!: string;

  @IsIn(['present', 'absent', 'late'])
  status!: 'present' | 'absent' | 'late';
}
