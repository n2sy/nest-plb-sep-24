import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
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

    if (result.length == 0)
      throw new NotFoundException("Ce livre n'existe pas");
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

  @Delete('softdelete/:id')
  async softDeleteBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.softsupprimerLivreV1(bookId);
    return {
      message: result.affected + 'Livre(s) soft supprimé(s) avec succès',
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

  @Delete('softremove/:id')
  async softRemoveBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.softsupprimerLivreV2(bookId);
    return {
      //   message: result.affected + 'Livre(s) supprimé(s) avec succès',
      result: result,
    };
  }

  @Delete('restore/:id')
  async restoreBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.restoreLivre(bookId);
    return {
      message: 'Livre restauré',
      result: result,
    };
  }

  @Patch('recover/:id')
  async recoverBook(@Param('id', ParseIntPipe) bookId) {
    let result = await this.bookSer.recoverLivre(bookId);
    return {
      message: 'Livre recover',
      result: result,
    };
  }

  @Get('stats')
  async nbBooksPerYear() {
    let result = await this.bookSer.nbreLivresParAnnee();
    return result;
  }

  @Get('stats2')
  async nbBooksBetweenTwoYears(@Query() qp) {
    console.log(qp);

    let result = await this.bookSer.nbreLivresEntreDeuxAnnees(
      qp.year1,
      qp.year2,
    );
    return result;
  }
}
