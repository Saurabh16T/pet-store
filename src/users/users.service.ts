import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'Saurabh', email: 'saurabh@example.com' },
    { id: 2, name: 'Bhargav', email: 'bhargav@example.com' },
  ];
  getUsers() {
    return this.users;
  }
  getUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
