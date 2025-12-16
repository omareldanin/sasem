import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './config';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MemberModule } from './app/member/member.module';
import { NotificationsModule } from './app/notification/notification.module';
import { EventModule } from './app/event/event.module';
import { SponsorModule } from './app/sponsor/sponsor.module';
import { FilesModule } from './app/files/files.module';
import { BlogModule } from './app/blogs/blogs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DB_HOST,
      port: 3306,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    MemberModule,
    AuthModule,
    NotificationsModule,
    EventModule,
    SponsorModule,
    FilesModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
