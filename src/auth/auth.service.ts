import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users: User[] = [];

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = {
      id: Date.now(),
      ...dto,
      password: hashed,
    };

    this.users.push(user);

    return { message: 'User created' };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((u) => u.email === dto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });

    return { access_token: token };
  }
}
