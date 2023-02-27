// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       signOptions: { expiresIn: '60s' },
//       secretOrKey: 'perritotriste',
//     });
//   }

//   async validate(payload: any) {
//     return this.authService.validateUserById(payload.sub);
//   }
// }
