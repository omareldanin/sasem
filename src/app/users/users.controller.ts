import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  UploadedFile,
} from '@nestjs/common';

import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserFiltersDto,
} from './user.dto';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';
import { UploadImageInterceptor } from '../../middlewares/file-upload.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('avatar')
  @Post('create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // GET /users?name=...&email=...
  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  getAll(@Query() filters: UserFiltersDto) {
    return this.usersService.getAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req['user']; // injected by JwtAuthGuard
    return this.usersService.getProfile(user.id);
  }

  // GET /users/:id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getOne(id);
  }

  // PATCH /users/:id
  @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('avatar')
  @Patch('update-profile')
  updateProfile(
    @Req() req: Request,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req['user'];
    if (file) {
      dto.avatar = 'uploads/' + file.filename; // or save full path if you want
    }
    return this.usersService.updateProfile(user.id, dto);
  }

  // PATCH /users/:id
  @UseGuards(JwtAuthGuard)
  @UploadImageInterceptor('avatar')
  @Patch(':id')
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateOne(id, dto);
  }
  // DELETE /users/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteOne(id);
  }
}
