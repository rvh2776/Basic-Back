import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Nombre del cliente.',
    example: 'Juan Perez',
    required: true,
  })
  @IsString({ message: 'Debe ser una cadena de strings' })
  @Length(2, 50, {
    message: 'El nombre debe tener entre 2 y 50 caracteres y es un string',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email del cliente.',
    example: 'jperez@mail.com',
    required: true,
  })
  @IsEmail({}, { message: 'El correo electronico no es valido' })
  @IsString({ message: 'Debe ser un email valido' })
  @Length(1, 100, {
    message: 'Debe tener entre 10 y 100 caracteres y es un string',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Identifica si el celular tiene WhatsApp.',
    example: 'false',
    required: false,
  })
  @IsBoolean({
    message: 'Identifica si el celular tiene WhatsApp para el contacto',
  })
  isWhatsApp: boolean;

  @ApiProperty({
    description: 'Celular.',
    example: '5492615101122',
    required: true,
  })
  @IsString({ message: 'Celular para el contacto' })
  @Length(1, 50, {
    message: 'Debe tener entre 1 y 50 carácteres y es un string',
  })
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({
    description: 'Mensaje que se recibe del cliente',
    example: 'Necesito mas información de la propiedad.',
    required: true,
  })
  @IsString({ message: 'El mensaje debe ser una cadena de carácteres' })
  @Length(3, 300, {
    message: 'El mensaje debe tener entre 3 y 300 carácteres',
  })
  @IsNotEmpty()
  mensaje: string;

  @ApiProperty({
    description: 'EL link a la propiedad que eligio el cliente.',
    example:
      'http://localhost:5173/detailsLangingPage/1374f442-945f-41f9-8258-5b31f5e9b6cd',
    required: true,
  })
  @IsString({ message: 'Debe ser una cadena de strings' })
  @Length(1, 300, {
    message: 'El link debe tener entre 10 y 300 carácteres y es un string',
  })
  @IsNotEmpty()
  propertyLink: string;

  @IsOptional()
  @IsEnum(['pendiente', 'en proceso', 'cerrado'], {
    message: 'El estado debe ser pendiente, en proceso o cerrado',
  })
  estado?: string;

  @ApiProperty({
    description: 'Id de la propiedad.',
    example: '1374f442-945f-41f9-8258-5b31f5e9b6cd',
  })
  @IsString({ message: 'Debe ser un UUID válido.' })
  @IsUUID('4', { message: 'El propertyId debe ser un UUID válido.' })
  @IsOptional()
  propertyId: string;

  @ApiProperty({
    description: 'Id del agente encargado de la propiedad.',
    example: '9d2677a9-ba6d-46cf-ac5e-df60ca7e1c37',
  })
  @IsString({ message: 'Debe ser un UUID válido.' })
  @IsUUID('4', { message: 'El userId debe ser un UUID válido.' })
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: 'Respuesta a la consulta de parte del agente',
    example: 'Acordamos una cita para mostrar la propiedad.',
    required: false,
  })
  @IsString({ message: 'El mensaje debe ser una cadena de carácteres' })
  @Length(3, 300, {
    message: 'El mensaje debe tener entre 3 y 300 carácteres',
  })
  @IsOptional()
  respuesta: string;

  @ApiProperty({
    description: 'Fecha de creación del mensaje, generado automaticamente',
    example: '16/07/2024',
  })
  createdAt: Date;
}
