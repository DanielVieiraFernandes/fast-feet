import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    return user.role;
  }
);
