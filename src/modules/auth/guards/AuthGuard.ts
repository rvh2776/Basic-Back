import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

//? Implementacion directa del AuthGaurd.

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Valor de authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMGM5YjEwNy00ODViLTQwOWUtYWU3ZC1iMjU1MjM1ZjRlOTMiLCJpZCI6IjIwYzliMTA3LTQ4NWItNDA5ZS1hZTdkLWIyNTUyMzVmNGU5MyIsImVtYWlsIjoicmFmYWVsLnZoQGdtYWlsLmNvbSIsImlhdCI6MTcxNzM0MTc4MCwiZXhwIjoxNzE3MzQ1MzgwfQ.GvtS8RJ4SdvS162mBXq5piwDoIUmHYTaQXY4-1m0HDIa
    const token = request.headers['authorization']?.split(' ')[1] ?? ''; //? Aca estoy tomando el token, ya que uso el segundo valor del array (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiO.......)

    if (!token) {
      throw new UnauthorizedException('Bearer token not found');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      // Convierto a: iat y exp horario local
      const iatDate = new Date(payload.iat * 1000);
      const expDate = new Date(payload.exp * 1000);

      // Formateo el Date a formato legible
      payload.iat = iatDate.toLocaleString();
      payload.exp = expDate.toLocaleString();

      request.user = payload;
      // console.log({ payload });

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
