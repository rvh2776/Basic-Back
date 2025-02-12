import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from './guards/roles.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from './dtos/UserDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidatorPipe } from 'src/pipes/fileValidator.pipe';
import { CloudinaryService } from 'src/common/cloudinary.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/images')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('imagen'))
  @UsePipes(FileValidatorPipe)
  async addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() imagen: Express.Multer.File,
  ): Promise<void> {
    try {
      if (!imagen) {
        throw new BadRequestException('No se subió ninguna imagen.');
      }

      const user = await this.usersService.getUserByID(id);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      if (user.publicId) {
        await this.cloudinaryService.deleteImage(user.publicId);
      }

      const imageDetails = await this.cloudinaryService.uploadImage(
        imagen,
        `YolandaStockAdmin/Users`,
      );

      const imageUrl = {
        url: imageDetails.url,
        publicId: imageDetails.public_id,
      };

      await this.usersService.addImages(id, imageUrl);
    } catch (error) {
      console.error('Error al agregar la imagen:', error);
      throw new BadRequestException(
        'No se pudo agregar la imagen a Cloudinary.',
      );
    }
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The users has been successfully retrieved.',
    type: UserDto,
  })
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll(@Req() req: Request) {
    const agente = req.user;

    console.log('Usuario:', agente.name);

    return this.usersService.findAll();
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: UserDto,
  })
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.getUserByID(id);

    return user;
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UpdateUserDto,
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userUpdate: UpdateUserDto,
    // @Req() req: Request,
  ) {
    // const reqUser = req.user;

    // console.log(reqUser);

    return this.usersService.updateUser(id, userUpdate);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UpdateUserDto,
  })
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Empleado)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('me/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUserMe(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userUpdate: UpdateUserDto,
    @Req() req: Request,
  ) {
    const reqUser = req.user;

    if (userUpdate.id !== reqUser.id) {
      throw new NotFoundException(`No tiene permitido editar a otro usuario.`);
    }

    return this.usersService.updateUserMe(id, userUpdate);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully changed.',
    schema: {
      type: 'string',
      example: {
        user: 'Jose Pedroza',
        isAdmin: true,
      },
    },
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('role/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateUserRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.updateUserRole(id);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: UserDto,
  })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  //? Ejemplo de uso Auth0.
  @ApiExcludeEndpoint()
  @Get('auth0')
  getAuth0Protected(@Req() req: Request) {
    console.log(req.oidc.user);
    return JSON.stringify(req.oidc.user);
  }
}
