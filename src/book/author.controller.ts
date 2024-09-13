import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('author')
@ApiTags('Auteurs')
export class AuthorController {
  @Inject(AuthorService) private authSer: AuthorService;

  @Get('all')
  async getAllAuthors() {
    let data = await this.authSer.chercherTousLesAuteurs();
    return { result: data };
  }

  @Post('add')
  async addAuthor(@Body() body) {
    let data = await this.authSer.ajouterAuteur(body);
    return {
      message: 'Auteur créé avec succès',
      result: data,
    };
  }

  @Get('all/:authorid')
  async getAuthorById(@Param('authorid') id) {
    let data = await this.authSer.chercherAuteurParId(id);
    return data;
  }

  @Delete('delete/:id')
  async deleteAuthor(@Param('id') id) {
    let data = await this.authSer.supprimerAuteur(id);
    return data;
  }
}
