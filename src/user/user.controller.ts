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
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { editProfileDto } from './dto/editProfile.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import UserSportDto from './dto/userSports.dto';

@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Edit User profile' })
  @ApiBearerAuth()
  @Put('edit/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async editProfile(
    @Param('id') userId: number,
    @Body() userData: editProfileDto,
    @Request() req,
  ) {
    if (+userId !== +req.user.id) {
      throw new UnauthorizedException(
        'You are not authorized to edit this profile',
      );
    } else {
      return this.userService.editUser(userData, req.user.id);
    }
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

  @UseGuards(JwtAuthGuard)
  async updateUserPhoto(): Promise<any> {
    return;
  }
}
