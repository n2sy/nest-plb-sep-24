import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamp } from '../timestamp/timestamp';
import { AuthorEntity } from './author.entity';
import { UserEntity } from 'src/auth/entities/user.entity';

@Entity('livre')
export class BookEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    // name: 'titre',
    length: 30,
    // unique: true,
    // update: false,
  })
  title: string;

  @Column()
  editor: string;

  @Column({
    type: 'int',
  })
  year: number;

  @ManyToOne(() => AuthorEntity, (a) => a.listeLivres, {
    //cascade: true,
  })
  author: AuthorEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
