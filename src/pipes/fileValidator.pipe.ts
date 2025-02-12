import {
  ArgumentMetadata,
  BadRequestException,
  FileTypeValidator,
  Injectable,
  ParseFilePipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      // console.log('Si no viene imagenes', value);
      return value; // Permitir array vacío si no hay imágenes
    }

    // Validar tipo de dato
    if (!Array.isArray(value)) {
      // console.log('Si viene imagenes', value);
      return value;
    }

    const minSize = 1 * 1024; // 1KB
    const maxSize = 5 * 1024 * 1024; // 5MB
    const fileTypeRegex = /(jpg|jpeg|png|webp)$/;

    const parseFilePipe = new ParseFilePipe({
      validators: [new FileTypeValidator({ fileType: fileTypeRegex })],
    });

    for (const file of value) {
      try {
        await parseFilePipe.transform(file);
      } catch (err) {
        throw new BadRequestException(
          `El archivo ${file.originalname} tiene un formato inválido. Solo se permiten archivos JPG, JPEG, PNG, o WEBP.`,
        );
      }

      if (file.size < minSize) {
        throw new BadRequestException(
          `El archivo ${file.originalname} no puede ser menor a 1KB`,
        );
      }

      if (file.size > maxSize) {
        throw new BadRequestException(
          `El archivo ${file.originalname} no puede ser mayor a 5MB`,
        );
      }
    }

    return value;
  }
}

// import {
//   ArgumentMetadata,
//   BadRequestException,
//   Injectable,
//   PipeTransform,
// } from '@nestjs/common';

// @Injectable()
// export class FileValidatorPipe implements PipeTransform {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   transform(value: any, metadata: ArgumentMetadata) {
//     // const minSize = 10 * 1024; // 10KB
//     const minSize = 1 * 1024; // 1KB
//     const maxSize = 5 * 1024 * 1024; // 5MB

//     if (value.size < minSize) {
//       throw new BadRequestException(
//         'El tamaño del archivo no puede ser menor a 10KB',
//       );
//     }

//     if (value.size > maxSize) {
//       throw new BadRequestException(
//         'El tamaño del archivo no puede ser mayor a 5MB',
//       );
//     }
//     return value;
//   }
// }
