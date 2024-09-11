import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  @Inject(BookService) bookSer: BookService;

  @Get('all')
  async getAllBooks() {
    // this.bookSer
    //   .chercherTousLesLivres()
    //   .then((response: BookEntity[]) => {
    //     return response;
    //   })
    //   .catch((err) => {
    //     throw new ConflictException();
    //   });
    let result = await this.bookSer.chercherTousLesLivres();
    return result;
  }

  @Post('add')
  async addBook(@Body() body) {
    let result = await this.bookSer.ajouterLivre(body);
    return result;
  }

  @Get('all/:id')
  async getBookById(@Param('id') id) {
    let result = await this.bookSer.chercherLivreParId(id);
    if (!result) throw new NotFoundException("Ce livre n'existe pas");
    return result[0];
  }
}
