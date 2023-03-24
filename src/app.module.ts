import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { SportModule } from './sport/sport.module';
import { EventModule } from './event/event.module';
// import { config } from './config/variables.config';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env.dev', '.env.prod'],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule,
    SportModule,
    EventModule,
  ],
})
export class AppModule {}
