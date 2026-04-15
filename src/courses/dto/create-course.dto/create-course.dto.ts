import { IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
