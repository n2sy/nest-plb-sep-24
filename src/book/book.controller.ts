import { Controller, Get, Inject } from '@nestjs/common';
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
}
