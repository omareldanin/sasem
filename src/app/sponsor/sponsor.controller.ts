// sponsors/sponsors.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { SponsorsService } from './sponsor.service';
import { CreateSponsorDto, UpdateSponsorDto } from './sponsor.dto';
import { JwtAuthGuard } from 'src/middlewares/jwt-auth.guard';
import { UploadImageInterceptor } from 'src/middlewares/file-upload.interceptor';

@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('image')
  @Post('create')
  create(
    @Body() dto: CreateSponsorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.image = 'uploads/' + file.filename; // or save full path if you want
    }
    return this.sponsorsService.create(dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('getAll')
  findAll(@Query() query: any) {
    return this.sponsorsService.findAll(query);
  }

  // @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('image')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateSponsorDto,
  ) {
    if (file) {
      dto.image = 'uploads/' + file.filename; // or save full path if you want
    }
    return this.sponsorsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sponsorsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sponsorsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/event/:eventId')
  getEventSponsors(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.sponsorsService.getEventSponsorsGrouped(eventId);
  }
}
