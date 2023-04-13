import { Repository } from './Repository';
import { User } from '../models/User';

export class UsersRepository extends Repository<User> {
  getTableName(): string {
    return 'users';
  }
}
