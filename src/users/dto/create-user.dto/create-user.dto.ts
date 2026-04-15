import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsIn(['admin', 'profesor', 'alumno'])
  role!: 'admin' | 'profesor' | 'alumno';
}
