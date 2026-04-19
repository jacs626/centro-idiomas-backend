import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: string) {
    const where: any = { deletedAt: null };
    if (role) {
      where.role = role;
    }
    const users = await this.prisma.user.findMany({
      where,
    });
    return users.map(({ password, ...user }) => user);
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
    const { password, ...result } = newUser;
    return result;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    const { password, ...result } = updated;
    return result;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    const { password, ...result } = user;
    return result;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, email: true, name: true, role: true, password: true, createdAt: true, deletedAt: true },
    });
  }

  async updatePassword(id: number, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }
}
