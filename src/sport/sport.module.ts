import { Module } from '@nestjs/common';
import { SportService } from './sport.service';
import { SportController } from './sport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from './entities/sport.entity';
import { SportLevel } from './entities/sportLevel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sport, SportLevel])],
  controllers: [SportController],
  providers: [SportService],
})
export class SportModule {}
