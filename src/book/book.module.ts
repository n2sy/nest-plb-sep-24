import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  providers: [BookService, AuthorService],
  controllers: [BookController, AuthorController],
})
export class BookModule {}
