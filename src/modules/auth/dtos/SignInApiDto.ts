import { ApiProperty } from '@nestjs/swagger';

export class SignInApiDto {
  @ApiProperty({ example: 'Autenticación exitosa.' })
  success: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMDFhOTlmNy00Y2M5LTQ1YzEtOTVlNy0zM2YwOTQ4OTZmZDEiLCJpZCI6IjMwMWE5OWY3LTRjYzktNDVjMS05NWU3LTMzZjA5NDg5NmZkMSIsImVtYWlsIjoiZXhhbXBsZUB0ZXN0LmNvbSIsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTcxODg0NDQ1MSwiZXhwIjoxNzE4ODQ4MDUxfQ.NJjaQs3MFLLGer_ZyKCB8cOQ38LPBalLTT5TVlfl6Js',
  })
  token: string;
}
