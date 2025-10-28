import { Controller, Get, ParseIntPipe, NotFoundException, Param } from '@nestjs/common';
import { UsersService, User } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): User[] {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): User | undefined {
    const user = this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
