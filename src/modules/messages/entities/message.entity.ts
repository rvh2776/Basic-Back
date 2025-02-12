import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  telefono: string;

  @Column({ type: 'boolean', nullable: false, default: false }) // Ahora es una columna
  isWhatsApp: boolean;

  @Column({ type: 'text', nullable: false })
  mensaje: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  propertyLink: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'en proceso', 'cerrado'],
    default: 'pendiente',
  })
  estado: string;

  @Column({ type: 'uuid', nullable: true })
  propertyId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'text', nullable: true })
  respuesta: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
