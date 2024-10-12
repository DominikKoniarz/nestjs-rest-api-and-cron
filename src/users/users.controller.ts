import { Controller, Delete, Get, Param, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { userIdSchema } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(userIdSchema))
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(userIdSchema))
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
