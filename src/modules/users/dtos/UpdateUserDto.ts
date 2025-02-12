import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './UserDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(UserDto) {
  @ApiProperty({
    description:
      'El nombre debe ser una cadena de caracteres, debe tener entre 3 y 80 caracteres.',
    example: 'Juan Pérez',
    required: false,
  })
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @Length(3, 80, { message: 'El nombre debe tener entre 3 y 80 caracteres' })
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario, debe ser un email válido.',
    example: 'example@test.com',
    required: false,
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @Length(6, 50, { message: 'El email debe tener entre 6 y 50 caracteres' })
  email?: string;

  @ApiProperty({
    description:
      'La contraseña debe ser una cadena de caracteres, debe tener entre 8 y 15 caracteres, contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.',
    example: 'Password123!',
    required: false,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres',
  })
  password?: string;

  @ApiProperty({
    description: 'Repetir la contraseña.',
    example: 'Password123!',
    required: false,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres',
  })
  rePassword?: string;
}
