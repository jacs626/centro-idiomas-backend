import { IsNumber, IsDateString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAttendanceDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  enrollmentId!: number;

  @IsDateString()
  date!: string;

  @IsIn(['present', 'absent', 'late'])
  status!: 'present' | 'absent' | 'late';
}
