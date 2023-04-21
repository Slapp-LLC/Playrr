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
  Catch,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { editProfileDto } from './dto/editProfile.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import UserSportDto from './dto/userSports.dto';
import { UserResponse } from 'src/auth/dto/userResponse.dto';
import { classToClassFromExist } from 'class-transformer';
@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Edit User profile' })
  @ApiBearerAuth()
  @Put('edit/:id')
  @UseGuards(JwtAuthGuard)
  async editProfile(
    @Param('id') userId: number,
    @Body() userData: editProfileDto,
    @Request() req,
  ) {
    return this.userService.editUser(userId, userData, req.user);
  }

  @Get('/myProfile')
  @UseGuards(JwtAuthGuard)
  async getMyData(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Delete User profile' })
  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Param('id') userId: number, @Request() req) {
    return this.userService.deleteUser(userId, req.user);
  }

  @ApiOperation({ summary: 'Add User Sport' })
  @Post('userSport/:id')
  @ApiBody({ type: UserSportDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addUserSport(@Body() userSport: UserSportDto, @Request() req) {
    console.log(userSport);
    return await this.userService.addUserSports(userSport, req.user.id);
  }

  @ApiOperation({ summary: 'Get user data' })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserData(@Param('id') id: string): Promise<any> {
    const user = await this.userService.findById(+id);
    return user;
  }
}
