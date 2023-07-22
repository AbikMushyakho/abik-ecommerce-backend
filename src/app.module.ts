import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB } from './config';
import { User } from './user/entities/user.entity';
import { OTP } from './otp/entities/otp.entity';
import { join } from 'path';
// import { User } from './user/entities/user.entity';
// import { OTP } from './otp/entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'postgres',
          host: DB.host,
          port: DB.port,
          username: DB.user,
          password: DB.password,
          database: DB.database,
          logging: true,
          synchronize: true,
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          entities: ['dist/**/*.entity.js'],
          // entities: [join(__dirname, './**/*.entity.{ts,js}')],
          // migrations: ['src/migrations/**/*{.ts,.js}'],
          // ssl: true,
          // autoLoadEntities: true,
        };
      },
    }),
    UserModule,
    OtpModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
