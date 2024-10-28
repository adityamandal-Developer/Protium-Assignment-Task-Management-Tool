import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//custom made decorators for getting the user from the request using inbuild nest features
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
