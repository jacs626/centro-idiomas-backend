import { IsNumber, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsNumber()
  enrollmentId!: number;

  @IsString()
  fileUrl!: string;
}
