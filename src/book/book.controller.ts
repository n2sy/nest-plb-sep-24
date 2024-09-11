import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

  @Put('edit/:id')
  async updateBook(@Body() body, @Param('id', ParseIntPipe) bookId) {
    console.log(typeof bookId);

    let result = await this.bookSer.editerLivre(body, bookId);
    return result;
  }

  @Delete('delete/:id')
  async deleteBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.supprimerLivreV1(bookId);
    return {
      message: result.affected + 'Livre(s) supprimé(s) avec succès',
      result: result,
    };
  }

  @Delete('remove/:id')
  async removeBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.supprimerLivreV2(bookId);
    return {
      //   message: result.affected + 'Livre(s) supprimé(s) avec succès',
      result: result,
    };
  }
}
