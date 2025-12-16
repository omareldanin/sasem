import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/config';
import { Event } from '../event/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, Event]),
    JwtModule.register({
      secret: env.ACCESS_TOKEN_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
