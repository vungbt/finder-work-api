import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { AuthRolesGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';

export type Payload = {
  id: string;
  type: 'user';
  role: UserRole;
};

export type AuthRolesOptions = {
  roles?: UserRole[];
  isOptional?: boolean;
};

export const AUTH_JWT_OPTIONS_KEY = 'AUTH_JWT_OPTIONS';

export const AuthRoles = (options: AuthRolesOptions = { roles: [], isOptional: false }) => {
  return applyDecorators(
    SetMetadata(AUTH_JWT_OPTIONS_KEY, options),
    UseGuards(JwtStrategy, AuthRolesGuard)
  );
};

export const ReqSession = createParamDecorator<boolean, ExecutionContext>(
  (exception = false, ctx: ExecutionContext) => {
    let user: User;
    switch (String(ctx.getType())) {
      case 'graphql':
        user = ctx.getArgByIndex(2).req.user;
        break;
      default:
        const request = ctx.switchToHttp().getRequest();
        user = request.user;
        break;
    }
    if (exception) {
      throw new HttpException(
        {
          key: 'error.unauthorized'
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    return user;
  }
);
