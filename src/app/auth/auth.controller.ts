// src/app/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';
import {
  ChangePasswordWithOtpDto,
  RequestOtpDto,
  VerifyOtpDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // -----------------------------------------
  // POST /auth/login
  // -----------------------------------------
  @Public()
  @UseInterceptors(NoFilesInterceptor())
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('fcm') fcm?: string,
  ) {
    if (!email || !password) {
      throw new UnauthorizedException('Missing credentials');
    }

    return this.service.login(email, password, fcm);
  }

  // -----------------------------------------
  // POST /auth/refresh
  // -----------------------------------------
  @Public()
  @UseInterceptors(NoFilesInterceptor())
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.service.refresh(refreshToken);
  }

  // -----------------------------------------
  // POST /auth/logout
  // (requires normal auth, we use req.user.id)
  // -----------------------------------------
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Body('refreshToken') refreshToken?: string) {
    const user = req['user'];
    if (!user) throw new UnauthorizedException('Not authenticated');

    return this.service.logout(user.id, refreshToken);
  }

  // -----------------------------------------
  // GET /auth/validate-token?token=...
  // -----------------------------------------
  @Public()
  @Get('validate-token')
  async validateToken(@Query('token') token: string) {
    if (!token) throw new UnauthorizedException('Token is required');
    return this.service.validateToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req['user']; // injected by JwtAuthGuard
    return this.service.getProfile(user.id);
  }

  @UseInterceptors(NoFilesInterceptor())
  @Public()
  @Post('password/request-otp')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.service.requestOtp(dto);
  }

  @UseInterceptors(NoFilesInterceptor())
  @Public()
  @Post('password/verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.service.verifyOtp(dto);
  }

  @UseInterceptors(NoFilesInterceptor())
  @Public()
  @Post('password/change')
  changePassword(@Body() dto: ChangePasswordWithOtpDto) {
    return this.service.changePasswordWithOtp(dto);
  }
}
