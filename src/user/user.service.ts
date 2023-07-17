import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { OtpService } from 'src/otp/otp.service';
import { OTPType } from 'src/otp/entities/otp.entity';
import { MailType, getMailTemplates } from 'src/helpers/templates-generator';
import { sendMail } from 'src/helpers/mail';

@Injectable()
export class UserService {
  constructor(
    // @InjectRepository(User) private userRepository:Repository<User>,
    private readonly dataSource: DataSource,
    private otpService: OtpService,
  ) {}

  async register(payload: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // check by email
      const emailExists = this.getUserByEmail(payload.email);
      if (emailExists) throw new BadRequestException('User already exists');

      // check by username
      const usernameExists = this.getUserByUsername(payload.username);
      if (usernameExists) throw new BadRequestException('User already exists');

      // password hasing
      const userDetails = { ...payload };
      userDetails.password = await argon.hash(payload.password);
      const { password, ...savedUser } = await queryRunner.manager
        .getRepository(User)
        .save(userDetails);

      // send Otp email
      const otp = await this.otpService.createOtp(
        savedUser.id,
        OTPType.emailVerification,
      );

      const html = await getMailTemplates(MailType.newRegistrationOtp, {
        otp: otp.code,
      });

      sendMail({
        to: savedUser.email,
        subject: 'Email Verification',
        html,
      });
      // send mail with otp

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(id: string) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        address: true,
        avatar: true,
        phone_number: true,
        bio: true,
        role: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserByEmail(email: string) {
    return await this.dataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });
  }

  async getUserByUsername(username: string) {
    return await this.dataSource.getRepository(User).findOne({
      where: {
        username,
      },
    });
  }
}
