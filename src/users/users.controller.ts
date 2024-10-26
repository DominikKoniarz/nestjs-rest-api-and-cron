import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { userIdSchema } from './users.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe(userIdSchema))
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
