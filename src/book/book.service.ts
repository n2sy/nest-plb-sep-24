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
    return this.bookRepo.find({
      //loadRelationIds: true,
      relations: {
        author: true,
      },
    });
  }

  ajouterLivre(nBook, idUser) {
    //nBook.user = idUser;
    let newBook = this.bookRepo.create({
      // title: nBook.title,
      // editor: nBook.editor,
      // year: nBook.year,
      // author: nBook.author,
      ...nBook,
      user: idUser,
    });
    return this.bookRepo.save(newBook);
  }

  chercherLivreParId(bookId) {
    return this.bookRepo.find({
      loadRelationIds: true,
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

  nbreLivresEntreDeuxAnnees(annee1, annee2) {
    const qb = this.bookRepo.createQueryBuilder('book');
    return (
      qb
        .select('book.year, count(book.id) as nbreDeLivres')
        // .where('book.year >= :a1 AND book.year <= :a2', {a1 : annee1, a2 : annee2})
        .where('book.year >= :a1 AND book.year <= :a2')
        .setParameters({ a1: annee1, a2: annee2 })
        .groupBy('book.year')
        .getRawMany()
    );
  }
}
