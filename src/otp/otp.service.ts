import { Injectable } from '@nestjs/common';

import { UpdateOtpDto } from './dto/update-otp.dto';

@Injectable()
export class OtpService {
  constructor() {}

  // async createOtp(userId: string, type: OTPType) {
  //   const code = await generateOTP(6);
  //   return this.dataSource.getRepository(OTP).save({ userId, type, code });
  // }

  findAll() {
    return `This action returns all otp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otp`;
  }

  update(id: number, updateOtpDto: UpdateOtpDto) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
