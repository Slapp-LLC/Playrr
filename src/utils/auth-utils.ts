import { BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/LocalRegister.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sanitizeUser } from '../utils/sanitizeUser';
import { UserService } from '../user/user.service'; // Import UsersService here

export async function createUserAndSanitize(
  usersService: UserService,
  userData: RegisterDto,
): Promise<any> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const formattedUser = { ...userData, password: hashedPassword };
  const newUser = await usersService.createUser(formattedUser);
  return sanitizeUser(newUser);
}

export async function createToken(
  jwtService: JwtService,
  user: any,
): Promise<string> {
  const payload = { email: user.email, sub: user.id };
  return jwtService.sign(payload);
}

export async function getUserData(
  usersService: UserService,
  userId: string,
): Promise<any> {
  const userData = await usersService.findById(parseInt(userId));
  console.log(userData);
  return userData;
}

export async function createLoginResponse(
  jwtService: JwtService,
  usersService: UserService,
  user: any,
): Promise<{ user: any; token: string }> {
  const token = await createToken(jwtService, user);
  const userData = await usersService.findById(user.id);
  return {
    user: userData,
    token: token,
  };
}

export async function validateUserPassword(
  user: any,
  password: string,
): Promise<boolean> {
  if (!user || !password || !user.password) {
    throw new BadRequestException('Invalid Credentials');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new BadRequestException('Invalid Credentials');
  }

  return true;
}
