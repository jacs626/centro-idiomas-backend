import { IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsIn(['active', 'dropped', 'completed'])
  @IsOptional()
  status?: 'active' | 'dropped' | 'completed';

  @IsNumber()
  @IsOptional()
  progress?: number;
}
