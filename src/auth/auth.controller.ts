import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authSer: AuthService) {}

  @Post('signup')
  async signup(@Body() credentials) {
    let data = await this.authSer.inscription(credentials);
    return {
      message: "User d'id " + data.id + ' créé avec succès',
      result: data,
    };
  }
}
