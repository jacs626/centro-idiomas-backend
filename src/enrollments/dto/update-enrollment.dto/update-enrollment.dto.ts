import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  progress?: number;
}
