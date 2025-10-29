import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { name: string; email: string; password: string }) {
    return await this.prisma.user.create({
      data,
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
