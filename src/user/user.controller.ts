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
  async editProfile(
    @Param('id') userId: number,
    @Body() userData: editProfileDto,
    @Request() req,
  ) {
    return this.userService.editUser(userId, userData, req.user);
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
  async addUserSport(@Body() userSports: UserSportDto[], @Request() req) {
    return await this.userService.addUserSports(userSports, req.user.id);
  }
}
