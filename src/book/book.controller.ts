import {
  BadRequestException,
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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { Request } from 'express';
import { AdminAuthGuard } from 'src/admin-auth/admin-auth.guard';
import { DurationInterceptor } from '../duration/duration.interceptor';

@Controller('book')
// @UseInterceptors(DurationInterceptor)
export class BookController {
  @Inject(BookService) bookSer: BookService;
  @Inject(AuthorService) authSer: AuthorService;

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

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addBook(@Req() request: Request, @Body() body) {
    let myAuthor = await this.authSer.chercherAuteurParId(body.author);
    if (!myAuthor)
      // if(myAuthor == null)
      throw new BadRequestException();

    let result = await this.bookSer.ajouterLivre(body, request.user['id']);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/:id')
  async getBookById(@Req() request: Request, @Param('id') id) {
    let result = await this.bookSer.chercherLivreParId(id);

    if (result.length == 0)
      throw new NotFoundException("Ce livre n'existe pas");
    return result[0];
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete('softremove/:id')
  async softRemoveBook(
    @Req() request: Request,
    @Param('id', ParseIntPipe) bookId,
  ) {
    let result = await this.bookSer.softsupprimerLivreV2(bookId, request.user);
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
