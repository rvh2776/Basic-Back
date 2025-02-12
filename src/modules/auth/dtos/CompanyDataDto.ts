import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO para los datos de la empresa (companyData)
class CompanyDataDto {
  @ApiProperty({ example: 'NombreEmpresa' })
  @IsString()
  client: string;

  @ApiProperty({ example: 'DNI' })
  @IsString()
  tipoDocum: string;

  @ApiProperty({ example: '45123456' })
  @IsString()
  documento: string;

  @ApiProperty({ example: '9261' })
  @IsString()
  codArea: string;

  @ApiProperty({ example: '5101206' })
  @IsString()
  telefono: string;

  @ApiProperty({ example: 'https://exmple-image.webp' })
  @IsString()
  imgUrl: string;
}

// DTO para los datos del usuario (userData)
class UserDataDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'jperez2@mail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'P@ssw0rd' })
  @IsString()
  rePassword: string;
}

// DTO principal que agrupa ambos
export class CreateCompanyAndUserDto {
  @ApiProperty({ type: CompanyDataDto })
  @ValidateNested()
  @Type(() => CompanyDataDto)
  companyData: CompanyDataDto;

  @ApiProperty({ type: UserDataDto })
  @ValidateNested()
  @Type(() => UserDataDto)
  userData: UserDataDto;
}
