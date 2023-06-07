import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/LocalRegister.dto';
import { UserResponse } from '../auth/dto/userResponse.dto';

export async function checkExistingUser(
  usersService,
  email?: string,
  id?: string,
): Promise<void> {
  let user;

  if (email) {
    user = await usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }
  } else if (id) {
    user = await usersService.findById(id);
    if (user) {
      throw new BadRequestException('User with this ID already exists');
    }
  } else {
    throw new Error('Email or ID must be provided');
  }
}
