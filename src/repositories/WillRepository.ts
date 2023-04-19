import { Repository } from './Repository';
import { Will } from '../models';

export class WillRepository extends Repository<Will> {
  getTableName(): string {
    return 'wills';
  }
}
