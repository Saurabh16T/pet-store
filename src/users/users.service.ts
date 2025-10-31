import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../common/hash.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    if (data.password) {
      data.password = await this.hashService.hash(data.password);
    }
    return await this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user || user.isDeleted) {
      throw new NotFoundException(`User with id ${id} not found or already deleted`);
    }
    if (data.password) {
      data.password = await this.hashService.hash(data.password);
    }
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // hard delete
  async deleteUserById(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        // predictable: record not found
        throw new NotFoundException(`User with id ${id} not found`);
      }
      // everything else is unexpected
      console.error('Unexpected error deleting user:', error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // soft delete
  async deleteUserById1(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user || user.isDeleted) {
      throw new NotFoundException(`User with id ${id} not found or already deleted`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getUsers(): Promise<User[]> {
    const users: User[] = await this.prisma.user.findMany();
    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
