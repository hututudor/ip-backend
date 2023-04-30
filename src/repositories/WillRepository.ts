import { Repository } from './Repository';
import { Will } from '../models';
import { knex } from '../db';

export class WillRepository extends Repository<Will> {
  getTableName(): string {
    return 'wills';
  }

  async getByUserId(userId: string): Promise<Will> {
    const data = await knex(this.getTableName()).where('userId', userId);
    return data[0];
  }
}
