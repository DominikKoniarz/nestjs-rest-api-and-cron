import { Body, Controller, Delete, Get, Post, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CreateUserDto, createUserSchema } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUser() {
    return this.usersService.getUserById('12');
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'User created';
  }

  @Delete(':id')
  async deleteUser() {
    return 'User deleted';
  }
}
