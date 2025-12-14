import { Module } from '@nestjs/common';
import { MemberService } from './member.service';

import { Member } from './member.entity';
import { User } from '../users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, User]),
    JwtModule.register({
      secret: env.ACCESS_TOKEN_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
