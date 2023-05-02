import { Repository } from './Repository';
import { Will } from '../models';
import { knex } from '../db';

export class WillRepository extends Repository<Will> {
  getTableName(): string {
    return 'wills';
  }

  async getByUserIdAndLobbyId(userId: string, lobbyId: string): Promise<Will> {
    const data = await knex(this.getTableName())
      .where('userId', userId)
      .andWhere('lobbyId', lobbyId);
    return data[0];
  }
}
