import { IsNumber, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  groupId!: number;

  @IsString()
  date!: string;

  @IsString()
  status!: 'present' | 'absent' | 'late';
}
