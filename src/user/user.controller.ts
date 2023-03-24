import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { editProfileDto } from './dto/editProfile.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get the hello message' })
  @ApiBearerAuth()
  @Put('edit/:id')
  @UseGuards(AuthGuard('jwt'))
  async editProfile(
    @Param('id') userId: number,
    @Body() userData: editProfileDto,
    @Request() req,
  ) {
    return this.userService.editUser(userId, userData, req.user);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProfile(@Param('id') userId: number, @Request() req) {
    return this.userService.deleteUser(userId, req.user);
  }

  @Post('userSport/:id')
  @UseGuards(AuthGuard('jwt'))
  async addUserSport(@Body() userSports, @Request() req) {
    try {
      await this.userService.addUserSports(userSports, req.user.id);
      return { message: 'Deporte añadido', status: HttpStatus.CREATED };
    } catch (error) {
      throw new HttpException(
        'Error adding user sport',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
