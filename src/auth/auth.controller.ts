import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  loginUserSchema,
  RegisterUserDto,
  registerUserSchema,
} from 'src/users/users.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async register(@Body() data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  async login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }
}
