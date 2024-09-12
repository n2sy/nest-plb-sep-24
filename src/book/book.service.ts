import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity) private bookRepo: Repository<BookEntity>,
  ) {}

  chercherTousLesLivres() {
    return this.bookRepo.find();
  }

  ajouterLivre(nBook) {
    return this.bookRepo.save(nBook);
  }

  chercherLivreParId(bookId) {
    return this.bookRepo.find({
      where: {
        id: bookId,
      },
    });
  }

  async editerLivre(uBook, bookId) {
    // booid : number
    let b = await this.bookRepo.preload({
      id: bookId,
      title: uBook.title,
      year: uBook.year,
      editor: uBook.editor,
    });

    return this.bookRepo.save(b);
  }

  supprimerLivreV1(id) {
    return this.bookRepo.delete(id);
  }

  async supprimerLivreV2(id) {
    let result = await this.chercherLivreParId(id);
    return this.bookRepo.remove(result);
  }

  softsupprimerLivreV1(id) {
    return this.bookRepo.softDelete(id);
  }

  async softsupprimerLivreV2(id) {
    let result = await this.chercherLivreParId(id);
    return this.bookRepo.softRemove(result);
  }

  restoreLivre(id) {
    return this.bookRepo.restore(id);
  }

  async recoverLivre(bookId) {
    let result = await this.bookRepo.find({
      withDeleted: true,
      where: {
        id: bookId,
      },
    });
    console.log(result);

    return this.bookRepo.recover(result);
  }

  nbreLivresParAnnee() {
    const qb = this.bookRepo.createQueryBuilder('book');
    return qb
      .select('book.year, count(book.id) as nbreDeLivres')
      .groupBy('book.year')
      .getRawMany();
  }
}
