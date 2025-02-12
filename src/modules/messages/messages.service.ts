import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { NodemailerService } from '../nodemailer/nodemailer.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    // let property = null;

    // if (createMessageDto.propertyId) {
    //   property = await this.propertyRepository.findOneBy({
    //     id: createMessageDto.propertyId,
    //   });

    //   if (!property) {
    //     throw new NotFoundException('La propiedad no existe');
    //   }
    // }

    if (createMessageDto.userId) {
      const user = await this.userRepository.findOneBy({
        id: createMessageDto.userId,
      });

      if (!user) {
        throw new NotFoundException('El usuario no existe');
      }
    }

    const newMessage = await this.messageRepository.save(createMessageDto);

    return {
      message: `Nuevo mensaje creado con exito: ${newMessage}`,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    estado: string = '',
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const query = this.messageRepository.createQueryBuilder('message');

    if (estado) {
      query.andWhere('message.estado = :estado', { estado });
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('message.name ILIKE :search', { search: `%${search}%` })
            .orWhere('message.email ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('message.mensaje ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('message.telefono ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('message.estado::TEXT ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    query.skip(skip).take(take);

    const [mensajes, total] = await query.getManyAndCount();

    return {
      data: mensajes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`El mensaje con id: ${id} no existe`);
    }
    return message;
  }

  async updateState(id: string, updateStateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Mensaje con id: ${id} no encontrado`);
    }

    const { estado } = updateStateMessageDto;

    if (!['pendiente', 'en proceso', 'cerrado'].includes(estado)) {
      throw new BadRequestException(
        'Estado no válido. Debe ser pendiente, en proceso o cerrado.',
      );
    }

    message.estado = estado;

    await this.messageRepository.save(message);

    return {
      success: true,
      message: `El estado del mensaje fue actualizado a: ${estado}`,
    };
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Mensaje con id: ${id} no encontrado`);
    }

    const { estado, respuesta } = updateMessageDto;

    if (!['pendiente', 'en proceso', 'cerrado'].includes(estado)) {
      throw new BadRequestException(
        'Estado no válido. Debe ser pendiente, en proceso o cerrado.',
      );
    }

    message.estado = estado;
    message.respuesta = respuesta;

    await this.messageRepository.save(message);

    return {
      success: true,
      message: `El mensaje fue actualizado: ${message}`,
    };
  }

  async remove(id: string) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Mensaje con id: ${id} no encontrado`);
    }

    await this.messageRepository.delete(id);

    return { success: `El mensaje con id: ${id} fue borrado con exito.` };
  }
}
