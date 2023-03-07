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
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { editProfileDto } from './dto/editProfile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
