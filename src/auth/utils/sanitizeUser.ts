import { User } from 'src/user/entities/user.entity';
import { UserResponse } from '../dto/userResponse.dto';
export function sanitizeUser(user): UserResponse {
  const {
    password,
    accessToken,
    passwordResetToken,
    passwordResetExpires,
    refreshToken,
    ...sanitizeUser
  } = user;
  return sanitizeUser;
}
