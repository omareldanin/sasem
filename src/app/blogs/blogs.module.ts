// blog/blog.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { BlogService } from './blogs.service';
import { BlogController } from './blogs.controller';
import { Event } from '../event/event.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Event]),
    JwtModule.register({
      secret: env.ACCESS_TOKEN_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
