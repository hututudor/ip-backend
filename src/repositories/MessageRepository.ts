import { Repository } from './Repository';
import { Message } from '../models';
import { knex } from '../db';

export class MessageRepository extends Repository<Message> {
  getTableName(): string {
    return 'messages';
  }
  async getMessageAfterTime(receiverId: string, lobbyId: string, time: number): Promise<Message[]> {
    return knex(this.getTableName())
      .where('receiverId', receiverId)
      .andWhere('lobbyId', lobbyId)
      .andWhere('time', '>', time);
  }
}
