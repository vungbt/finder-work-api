import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_JWT_OPTIONS_KEY, AuthRolesOptions } from './jwt.decorator';

@Injectable()
export class AuthRolesGuard extends AuthGuard('jwt') {
  private options: undefined | AuthRolesOptions;

  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    switch (String(context.getType())) {
      case 'graphql':
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
      default:
        return context.switchToHttp().getRequest();
    }
  }

  canActivate(context: ExecutionContext) {
    this.options = this.reflector.getAllAndOverride<AuthRolesOptions>(AUTH_JWT_OPTIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (this.options?.roles || this.options?.isOptional) {
      return super.canActivate(context);
    }
    return true;
  }

  handleRequest(err, user) {
    const requiredRoles = this.options.roles;
    const isOptional = this.options.isOptional ?? false;
    if (err) {
      throw new HttpException(
        {
          key: 'error.unauthorized'
        },
        HttpStatus.UNAUTHORIZED
      );
    } else if (!user && !isOptional) {
      throw new HttpException(
        {
          key: 'error.unauthorized'
        },
        HttpStatus.UNAUTHORIZED
      );
    } else if (user && user.role && requiredRoles && requiredRoles.length > 0) {
      const userRole = user.role;
      const isActive = requiredRoles.includes(userRole);
      if (!isActive)
        throw new HttpException(
          {
            key: 'error.forbidden'
          },
          HttpStatus.UNAUTHORIZED
        );
    }
    return user;
  }
}
