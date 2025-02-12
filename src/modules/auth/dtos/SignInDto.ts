import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'El correo electrónico del usuario, debe ser un email válido con una longitud entre 6 y 50 caracteres',
    example: 'usuario@mail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'La contraseña del usuario, debe ser una cadena de caracteres con una longitud entre 8 y 15 caracteres y debe cumplir con ciertos criterios de complejidad',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
