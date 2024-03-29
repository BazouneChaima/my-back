import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy , "jwt" ) {
  constructor(config :  ConfigService , private prisma : PrismaService) {
    //console.log('token => ' + ExtractJwt.fromHeader("Authorization"))
    super({
      jwtFromRequest: ExtractJwt.fromHeader("bc_token"),
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),// need to add Bearer to auth tokens 
      secretOrKey : config.get('JWT_SECRET'),
    });
  
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      //console.log({payload})
    delete user.password;
    return user;
  }
}
