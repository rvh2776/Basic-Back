import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CliCredentialsDto {
  @ApiProperty({
    description: 'El id del usuario, debe existir y ser un UUID valido.',
    example: 'a15f072b-3273-432a-97be-9472f0a30949',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'El clientId, debe existir y ser un UUID valido.',
    example: '7c702499-b2d4-4ad7-aa77-98c6075c8f42',
  })
  @IsNotEmpty()
  @IsString()
  clientId: string;
}
