// files/files.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto, UpdateFileDto } from './file.dto';
import { JwtAuthGuard } from 'src/middlewares/jwt-auth.guard';
import { UploadFileInterceptor } from 'src/middlewares/file-upload.interceptor';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // ---------- CREATE ----------

  @UseGuards(JwtAuthGuard)
  @UploadFileInterceptor('file')
  @Post('create')
  create(
    @Body() dto: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.file = 'uploads/files/' + file.filename; // or save full path if you want
    }
    return this.filesService.create(dto);
  }

  // ---------- GET ALL ----------
  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  findAll(@Query() query: any) {
    return this.filesService.findAll(query);
  }

  // ---------- UPDATE ----------
  @UseGuards(JwtAuthGuard)
  @UploadFileInterceptor('file')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.file = 'uploads/files/' + file.filename; // or save full path if you want
    }
    return this.filesService.update(id, dto);
  }

  // ---------- DELETE ----------\
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
