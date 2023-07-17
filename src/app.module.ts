import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [UserModule, OtpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
