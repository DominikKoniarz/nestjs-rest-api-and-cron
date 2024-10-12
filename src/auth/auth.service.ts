import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  public saltRounds: number = 11;

  constructor(private usersService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async register(data: RegisterUserDto) {
    const foundUser = await this.usersService.getUserByEmail(data.email);

    if (foundUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await this.usersService.createUser({
      email: data.email,
      password: hashedPassword,
    });

    return newUser;
  }
}
