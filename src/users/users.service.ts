import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import * as bcrypt from 'bcrypt';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll() {
    return this.users.map(({ password, ...user }) => user);
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser: User = {
      id: Date.now(),
      ...dto,
      password: hashedPassword,
    };
    this.users.push(newUser);
    const { password, ...result } = newUser;
    return result;
  }

  update(id: number, dto: UpdateUserDto) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users[index] = { ...this.users[index], ...dto };
    const { password, ...result } = this.users[index];
    return result;
  }

  remove(id: number) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const deleted = this.users.splice(index, 1);
    const { password, ...result } = deleted[0];
    return result;
  }

  findById(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}