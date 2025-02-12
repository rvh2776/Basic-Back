import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DateAdderInterceptor } from '../../interceptors/date-adder.interceptor';
import { UserCredentialsDto } from './dtos/UserCredentials.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../users/dtos/UserDto';
import { SignInApiDto } from './dtos/SignInApiDto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from './guards/AuthGuard';
import { Role } from './roles.enum';
import { RolesGuard } from '../users/guards/roles.guard';
import { Request } from 'express';
import { SiginUserDto } from './dtos/SiginUserDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @Post('signup')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(DateAdderInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createUser(@Body() user: SiginUserDto, @Req() req: Request) {
    const agente = req.user;
    user.agente = agente.name;

    return this.authService.signUp({ ...user });
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully login.',
    type: SignInApiDto,
  })
  @Post('signin')
  @HttpCode(200)
  async loginUser(@Body() signIn: UserCredentialsDto) {
    return this.authService.validateUser(signIn.email, signIn.password);
  }

  @ApiOperation({ summary: 'Renew token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully renewed token.',
  })
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const user = req.user; // Este payload ya viene del AuthGuard

    return await this.authService.refreshToken(user);
  }
}
