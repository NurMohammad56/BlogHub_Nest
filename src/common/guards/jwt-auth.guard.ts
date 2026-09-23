import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser>(
    err: Error | null,
    user: TUser,
    info: { name?: string } | undefined,
  ) {
    if (err || !user) {
      if (info?.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Access token has expired");
      }
      if (info?.name === "TokenExpiredError") {
        throw new UnauthorizedException("Invalid access token");
      }
      throw err || new UnauthorizedException("Authentication required");
    }
    return user;
  }
}
