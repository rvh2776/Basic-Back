import { IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50, nullable: false })
  @IsString()
  @Length(1, 50)
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  @IsString()
  @Length(1, 50)
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  @IsString()
  @Length(1, 60)
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'images/profileImage.png',
  })
  imgUrl: string;

  @Column({ type: 'varchar', nullable: true })
  publicId: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsString()
  @Length(1, 20)
  whatsApp: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @IsString()
  @Length(1, 30)
  telefono: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  @IsString()
  @Length(1, 120)
  descripcion: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  agente: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
