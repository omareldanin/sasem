// blog/blog.controller.ts
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
import { BlogService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './blog.dto';
import { JwtAuthGuard } from 'src/middlewares/jwt-auth.guard';
import { UploadImageInterceptor } from 'src/middlewares/file-upload.interceptor';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateBlogDto) {
    console.log(dto);

    return this.blogService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('image')
  @Post('upload-image')
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      return { url: 'uploads/' + file.filename }; // or save full path if you want
    }

    return { message: 'no image' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  findAll(@Query() query: any) {
    return this.blogService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: 'ar' | 'en',
  ) {
    return this.blogService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
