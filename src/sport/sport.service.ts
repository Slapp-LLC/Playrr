import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';
import { SportLevel } from './entities/sportLevel.entity';

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(SportLevel)
    private readonly sportLevelRepository: Repository<SportLevel>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}
  create(createSportDto: CreateSportDto) {
    return 'This action adds a new sport';
  }

  async findAll() {
    const sports = await this.sportRepository.find();
    return sports;
  }
  async findAllLevels() {
    const levels = await this.sportLevelRepository.find();
    return levels;
  }
  findOne(id: number) {
    return `This action returns a #${id} sport`;
  }

  update(id: number, updateSportDto: UpdateSportDto) {
    return `This action updates a #${id} sport`;
  }

  remove(id: number) {
    return `This action removes a #${id} sport`;
  }
}
