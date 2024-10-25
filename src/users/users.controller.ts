import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { userIdSchema } from './users.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(userIdSchema))
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
