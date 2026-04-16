import { IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name!: string;

  @IsString()
  level!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
