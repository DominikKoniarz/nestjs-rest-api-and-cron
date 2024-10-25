import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({ message: 'Token not found' });
    }

    try {
      const payload = await this.authService.verifyAccessToken(token);

      const foundUser = await this.usersService.getUserById(payload.sub);

      if (!foundUser) {
        throw new UnauthorizedException();
      }

      request['user'] = foundUser;
    } catch {
      // error instance of JsonWebTokenError if token is invalid
      throw new UnauthorizedException({
        message: 'Invalid token',
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
