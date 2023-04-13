import { Repository } from './Repository';
import { Message } from '../models';

export class MessageRepository extends Repository<Message> {
  getTableName(): string {
    return 'messages';
  }
}
