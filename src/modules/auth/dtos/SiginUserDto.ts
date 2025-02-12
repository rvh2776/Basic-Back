import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../../users/dtos/UserDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SiginUserDto extends PartialType(UserDto) {
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

  @ApiProperty({
    description: 'imgUrl se usa para que pueda subir la imagen de su Profile',
    example: 'images/profileImage-blue.png',
    default: 'images/profileImage-blue.png',
    required: true,
  })
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: 'Número completo de whatsApp.',
    example: '5492616141234',
    required: false,
  })
  @IsString({ message: 'Número completo de whatsApp' })
  @Length(12, 20, {
    message: 'El número debe tener entre 13 y 20 caracteres y es un string',
  })
  @IsNotEmpty()
  whatsApp: string;

  @ApiProperty({
    description: 'Número completo de teléfono.',
    example: '5492616141234',
    required: true,
  })
  @IsString({ message: 'Número completo de teléfono' })
  @Length(12, 20, {
    message: 'El número debe tener entre 13 y 20 caracteres y es un string',
  })
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({
    description:
      'La descripción debe ser lo mas cercana posible al puesto que cumple el agente, debe tener entre 3 y 80 caracteres',
    example: 'Corredor inmobiliario.',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de caracteres' })
  @Length(3, 80, {
    message: 'La descripción debe tener entre 1 y 120 caracteres',
  })
  @IsNotEmpty()
  descripcion: string;
}
