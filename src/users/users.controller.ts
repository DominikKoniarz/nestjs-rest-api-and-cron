import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  async getAllUsers() {
    return 'All users';
  }

  @Get(':id')
  async getUser() {
    return 'User';
  }

  @Post('')
  async createUser() {
    return 'User created';
  }

  @Delete(':id')
  async deleteUser() {
    return 'User deleted';
  }
}
