import { Repository } from './Repository';
import { Lobby } from '../models';

export class LobbyRepository extends Repository<Lobby> {
  getTableName(): string {
    return 'Lobbies';
  }
}
