import { Injectable } from '@nestjs/common';
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
      salt: await bcrypt.genSalt(),
      role: RoleEnum.ROLE_USER,
    });

    newUser.password = await bcrypt.hash(identifiants.password, newUser.salt);
    return this.userRep.save(newUser);
  }
}
