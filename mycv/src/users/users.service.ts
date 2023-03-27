import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string): Promise<User> {
    // This creates the User entity
    const user = this.repo.create({ email, password });
    // This saves/persists the User entity and runs any defined entity hooks
    return this.repo.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.repo.findOne({ where: { id } });
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  // Partial is a typescript feature that allows you to pass in 0 to many arguments for User
  async update(id: number, attrs: Partial<User>): Promise<User> {
    // You must find the User entity first before updating it (aka calling save to persist to db)
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found!');
    }
    // Object.assign is a builtin function that will take any attrs and overwrite them on the user object
    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found!');
    }
    return this.repo.remove(user);
  }
}
