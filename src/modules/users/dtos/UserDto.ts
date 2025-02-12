import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'El ID del usuario, debe ser un UUID válido',
    example: '87cecae9-fb7c-4046-a878-1aabcdb83f29',
  })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido' })
  id: string;

  @ApiProperty({
    description:
      'El nombre debe ser una cadena de caracteres, debe tener entre 3 y 80 caracteres.',
    example: 'Juan Pérez',
    required: true,
  })
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @Length(3, 80, { message: 'El nombre debe tener entre 3 y 80 caracteres' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'El correo electrónico del usuario, debe ser un email válido con una longitud entre 6 y 50 caracteres',
    example: 'example@test.com',
  })
  @IsEmail({}, { message: 'El correo electronico no es valido' })
  @Length(6, 50, { message: 'El email debe tener entre 6 y 50 caracteres' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @MinLength(8, { message: 'La contraseña debe tener entre 8 y 15 caracteres' })
  @MaxLength(15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*',
  })
  password: string;

  @IsString()
  rePassword: string;

  @ApiProperty({
    description: 'imgUrl se usa para que pueda subir la imagen de su Profile',
    example: 'https://exmple-image.webp',
    default: 'images/profileImage.png',
    required: true,
  })
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: 'publicId se usa para borrar, actualizar la imagen Profile',
    example: 'ca1esegjgvewoxmzwk5c',
    required: false,
  })
  @IsString()
  publicId: string;

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
      'La descripción debe ser lo mas cercana posible al puesto que cumple el agente, debe tener entre 1 y 100 caracteres',
    example: 'Corredor inmobiliario.',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de caracteres' })
  @Length(3, 100, {
    message: 'La descripción debe tener entre 1 y 100 caracteres',
  })
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description:
      'Indica si el usuario es administrador, no se debe enviar en el body',
    example: false,
    required: false,
  })
  @IsNotEmpty()
  isAdmin: boolean;

  @ApiProperty({
    description: 'El agente es el usuario quien crea al nuevo usuario.',
  })
  @IsString()
  agente: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario, generado automaticamente',
    example: '16/07/2024',
  })
  createdAt: Date;
}
