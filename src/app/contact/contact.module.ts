// contact/contact.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/config';
import { Contact } from './contact.entity';
import { Event } from '../event/event.entity';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, Event]),
    JwtModule.register({
      secret: env.ACCESS_TOKEN_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
