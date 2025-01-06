import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userRole = request.headers["x-role"];
    if(userRole !== "admin") {
      throw new ForbiddenException('Доступ запрещён: требуется роль admin')
    }

    return true;
  }
}
