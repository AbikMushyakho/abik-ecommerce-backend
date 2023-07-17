import { OTP } from 'src/otp/entities/otp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRoles {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  User = 'user',
  vendor = 'vendor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.User,
  })
  role: UserRoles;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ select: false, nullable: true })
  password: string;

  @OneToMany(() => OTP, (otp) => otp.user)
  otps: OTP[];
}
