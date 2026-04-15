import { IsNumber, Min, Max, IsInt, IsEnum } from 'class-validator';
import { LanguageLevel } from '../../enums/language-level.enum';

export class CreateProgressDto {
  @IsNumber()
  @IsInt()
  userId!: number;

  @IsNumber()
  @IsInt()
  courseId!: number;

  @IsEnum(LanguageLevel)
  level!: LanguageLevel;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  percentage!: number;
}
