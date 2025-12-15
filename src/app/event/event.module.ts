import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/config';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event]),
    JwtModule.register({
      secret: env.ACCESS_TOKEN_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
