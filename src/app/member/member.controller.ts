import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { MemberService } from './member.service';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';
import { UploadImageInterceptor } from '../../middlewares/file-upload.interceptor';

@Controller('members')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('avatar')
  @Post('create')
  create(
    @Body() dto: CreateMemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.avatar = 'uploads/' + file.filename; // or save full path if you want
    }

    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  getAll(@Query() filters: any) {
    return this.service.getAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('avatar')
  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateMemberDto,
  ) {
    if (file) {
      dto.avatar = 'uploads/' + file.filename; // or save full path if you want
    }
    return this.service.updateOne(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteOne(id);
  }
}
