import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = context.switchToWs();
      const client = ctx.getClient();
      const token = client.handshake.query.token;
      console.log(token);
      if (!token) {
        throw new WsException('Unauthorized');
      }
      const jwtSecret = this.configService.get<string>('JWT_SECRET');

      const decoded = this.jwtService.verify(token, {
        secret: jwtSecret,
      });
      client.user = decoded.sub;
      return true;
    } catch (error) {
      console.log(error);
      throw new WsException('Unauthorized');
    }
  }
}
