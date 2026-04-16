import { IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name!: string;

  @IsString()
  level!: string;

  @IsString()
  description!: string;
}
