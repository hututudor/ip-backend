import { Repository } from './Repository';
import { User } from '../models/User';
import { knex } from '../db';

export class UsersRepository extends Repository<User> {
  getTableName(): string {
    return 'users';
  }
  async findByUserName(username: string) {
    return knex(this.getTableName())
      .select('*')
      .where({
        username: username,
      })
      .then(users => {
        return { user: users[0] };
      })
      .catch(err => {
        throw new Error(err.message);
      });
  }
}
