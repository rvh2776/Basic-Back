import { PickType } from '@nestjs/swagger';
import { SignInDto } from './SignInDto';

export class UserCredentialsDto extends PickType(SignInDto, [
  'email',
  'password',
]) {}
