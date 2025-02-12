import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async findAll() {
    const totalUsuarios = await this.usersRepository.count();
    // const totalPropiedades = await this.propiedadesRepository.count();
    const totalMensajes = await this.messagesRepository.count();

    const usuariosPorRole = await this.usersRepository
      .createQueryBuilder('users')
      .select('users.isAdmin', 'role')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('users.isAdmin')
      .getRawMany();

    // const propiedadesPorTipoOperacion = await this.propiedadesRepository
    //   .createQueryBuilder('propiedades')
    //   .select('propiedades.tipoOperacion', 'operacion')
    //   .addSelect('COUNT(*)', 'cantidad')
    //   .groupBy('propiedades.tipoOperacion')
    //   .getRawMany();

    const mensajesPorEstado = await this.messagesRepository
      .createQueryBuilder('mensajes')
      .select('mensajes.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('mensajes.estado')
      .getRawMany();

    return {
      totalUsuarios,
      // totalPropiedades,
      totalMensajes,
      usuariosPorRole,
      // propiedadesPorTipoOperacion,
      mensajesPorEstado,
    };
  }
}
