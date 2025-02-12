import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';
import { SiginUserDto } from './dtos/SiginUserDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(user: SiginUserDto) {
    const existUser = await this.usersService.findByEmail(user.email);

    console.log(user);

    if (existUser) {
      throw new BadRequestException(
        `Ya existe un usuario con el email: ${user.email}`,
      );
    }

    if (!user.password || !user.rePassword) {
      throw new BadRequestException(
        'El password y su confirmación son obligatorios',
      );
    }

    if (user.password !== user.rePassword) {
      throw new BadRequestException('Confirmación de password incorrecta');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    await this.usersService.createUser(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, rePassword, ...userOut } = user;

    return userOut;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // throw new BadRequestException('Email o password incorrectos');
      throw new UnauthorizedException('Email o password incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    const userPayload = {
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      imgUrl: user.imgUrl,
      roles: user.isAdmin ? Role.Admin : Role.Empleado,
      // isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };

    // const token = this.jwtService.sign(userPayload, { expiresIn: '60m' });
    const token = this.jwtService.sign(userPayload);

    const decodedToken = this.jwtService.decode(token);

    const iat = new Date(decodedToken.iat * 1000).toLocaleString();
    const exp = new Date(decodedToken.exp * 1000).toLocaleString();

    return {
      success: `Autenticación exitosa.`,
      token,
      issuedAt: iat,
      expiresAt: exp,
    };
  }

  async refreshToken(user: any) {
    try {
      // Generar un nuevo token con la misma información del payload
      const newToken = this.jwtService.sign(
        {
          sub: user.sub,
          id: user.id,
          name: user.name,
          email: user.email,
          imgUrl: user.imgUrl,
          roles: user.roles,
          createdAt: user.createdAt,
        },
        {
          expiresIn: '1h', // Nueva duración
        },
      );

      return { token: newToken };
    } catch (error) {
      throw new InternalServerErrorException('Error al renovar el token');
    }
  }
}
