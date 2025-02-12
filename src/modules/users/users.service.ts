import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository, DataSource } from 'typeorm';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async addImages(id: string, imageDetails: { url: string; publicId: string }) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.imgUrl = imageDetails.url;
    user.publicId = imageDetails.publicId;

    await this.usersRepository.save(user);

    return {
      success: `La imagen fue guardada con éxito.`,
      images: imageDetails,
    };
  }

  async findByEmail(email: string): Promise<UpdateUserDto | undefined> {
    const userEmail = this.usersRepository.findOne({
      where: { email },
    });

    return userEmail;
  }

  async findAll() {
    const users = await this.usersRepository.find();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersOut = users.map(({ password, ...users }) => {
      return users;
    });
    return usersOut;
  }

  async getUserByID(id: string): Promise<UpdateUserDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userOut } = user;

    return userOut;
  }

  async createUser(user: UpdateUserDto) {
    const newUser = await this.usersRepository.save(user);
    return newUser;
  }

  async updateUser(id: string, userUpdate: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    const updatedUser = { ...user, ...userUpdate, id };

    await this.usersRepository.update(id, updatedUser);
    await this.usersRepository.save(updatedUser);

    return updatedUser.id;
  }

  async updateUserMe(id: string, userUpdate: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    const updatedUser = { ...user, ...userUpdate, id };

    await this.usersRepository.update(id, updatedUser);
    await this.usersRepository.save(updatedUser);

    return updatedUser.id;
  }

  async updateUserRole(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    if (user.isAdmin) {
      user.isAdmin = false;
    } else {
      user.isAdmin = true;
    }
    // user.isAdmin = !user.isAdmin;

    await this.usersRepository.save(user);
    return {
      user: user.name,
      isAdmin: user.isAdmin,
    };
  }

  async deleteUser(id: string) {
    const userDel = await this.usersRepository.findOne({
      where: { id },
    });

    if (!userDel) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    // Elimino la imagen de perfil del usuario en Cloudinary.
    if (userDel.publicId) {
      try {
        await this.cloudinaryService.deleteImage(userDel.publicId);
      } catch (error) {
        console.error('Error eliminando imagen de Cloudinary:', error);
        throw new Error('No se pudo eliminar la imagen de perfil del usuario');
      }
    }

    await this.usersRepository.remove(userDel);

    return { message: `Usuario con id: ${id} eliminado con éxito` };
  }
}
