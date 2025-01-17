import { HttpException, HttpStatus, Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';

const SALT_ROUNDS = 10;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByID(id: number): Promise<User | undefined> {
    const userDetails = await this.usersRepository.findOne({ where: { id } });
    if (!userDetails)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return userDetails;
  }

  async create(user: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>, @Request() req): Promise<User> {
    const userDetails = await this.usersRepository.findOne({ where: { id } });
    if (!userDetails)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    if (user.password) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }

    user.updated_by = req.user.sub;

    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
