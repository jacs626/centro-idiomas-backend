import { IsNumber, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  groupId!: number;

  @IsString()
  status!: string;
}
