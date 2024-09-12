import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from './generics/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRep: Repository<UserEntity>,
  ) {}

  async inscription(identifiants) {
    let newUser = this.userRep.create({
      email: identifiants.email,
      username: identifiants.username,
      //   password : identifiants.password,
      salt: await bcrypt.genSalt(),
      role: RoleEnum.ROLE_USER,
    });

    newUser.password = await bcrypt.hash(identifiants.password, newUser.salt);
    return this.userRep.save(newUser);
  }

  async seConnecter(body) {
    // let identifiant = body.identifiant;
    // let password = body.password
    let { identifiant, password } = body;
    let qb = this.userRep.createQueryBuilder('user');
    let u = await qb
      .select('user')
      .where('user.username = :ident OR user.email = :ident', {
        ident: identifiant,
      })
      .getOne();

    if (!u) throw new NotFoundException('Username ou Email inexistant');

    const result = await bcrypt.compare(password, u.password);

    if (!result) throw new NotFoundException('Mot de passe erroné');
    else {
      return u;
    }
  }
}
