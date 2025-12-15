import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/middlewares/jwt-auth.guard';
import { CreateEventDto, UpdateEventDto } from './event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventService.create(dto, req.user);
  }

  // 📄 Get all
  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  findAll(@Query() query: any, @Req() req: any) {
    const user = req['user'];
    return this.eventService.findAll(query, user);
  }

  // 📄 Get one
  @UseGuards(JwtAuthGuard)
  @Get(':id/users')
  getEventUsers(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.eventService.getEventUsers(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.eventService.getOne(id, query);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.eventService.update(id, dto);
  }

  // ❌ Delete (ADMIN only)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.remove(id);
  }
}
