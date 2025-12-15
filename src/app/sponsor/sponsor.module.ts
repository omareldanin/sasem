import { Module } from '@nestjs/common';
import { SponsorsService } from './sponsor.service';
import { SponsorsController } from './sponsor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsor } from './sponsor.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/config';
import { Event } from '../event/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sponsor, Event]),
    JwtModule.register({
      secret: env.ACCESS_TOKEN_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [SponsorsService],
  controllers: [SponsorsController],
})
export class SponsorModule {}
