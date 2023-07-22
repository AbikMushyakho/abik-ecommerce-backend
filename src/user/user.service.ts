import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, verifyOtpDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { OTP, OTPType } from 'src/otp/entities/otp.entity';
import { MailType, getMailTemplates } from 'src/helpers/templates-generator';
import { sendMail } from 'src/helpers/mail';
import { generateOTP } from 'src/helpers/utils';
import { globalResponse } from 'src/helpers/globalResponse';

@Injectable()
export class UserService {
  constructor(
    // @InjectRepository(User) private userRepository:Repository<User>,
    private readonly dataSource: DataSource, // private otpService: OtpService,
  ) {}

  async register(payload: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // check by email
      const emailExists = await this.dataSource.getRepository(User).findOne({
        where: {
          email: payload.email,
        },
        select: { email: true },
      });
      if (emailExists) throw new BadRequestException('User already exists');

      // check by username
      const usernameExists = await this.dataSource.getRepository(User).findOne({
        where: {
          username: payload.username,
        },
        select: {
          username: true,
        },
      });
      if (usernameExists) throw new BadRequestException('User already exists');

      // password hasing
      const userDetails = { ...payload };
      userDetails.password = await argon.hash(payload.password);
      const { password, ...savedUser } = await queryRunner.manager
        .getRepository(User)
        .save(userDetails);

      // send Otp email

      const code = await generateOTP(6);
      await queryRunner.manager
        .getRepository(OTP)
        .save({ user_id: savedUser.id, type: OTPType.emailVerification, code });

      // Commiting changes

      const html = await getMailTemplates(MailType.newRegistrationOtp, {
        otp: code,
      });
      sendMail({
        to: savedUser.email,
        subject: 'Email Verification',
        html,
      });
      // send mail with otp
      await queryRunner.commitTransaction();

      return globalResponse(true, 'Registeration Success', savedUser);
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
        full_name: true,
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

  async verifyOtp(email: string, otp: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.dataSource.getRepository(User).findOne({
        where: {
          email,
        },
        select: {
          id: true,
          isVerified: true,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      // check user is already verified
      if (user.isVerified)
        throw new BadRequestException('User Already verified');

      // Find otp
      const foundOtp = await this.dataSource.getRepository(OTP).findOne({
        where: {
          user_id: user.id,
          code: otp,
          type: OTPType.emailVerification,
        },
      });
      if (!foundOtp) throw new NotFoundException('Please register first!!');

      // validate otp
      // OTP is valid for 15 minutes only
      const expiryTime = 1000 * 60 * 15;
      if (foundOtp.created_at.getTime() + expiryTime < Date.now()) {
        throw new BadRequestException('OTP has expired!');
      }

      // upadate user to verified
      user.isVerified = true;
      await queryRunner.manager.getRepository(User).save(user);

      await queryRunner.commitTransaction();
      return globalResponse(true, 'OTP veification successful', { email });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
}
