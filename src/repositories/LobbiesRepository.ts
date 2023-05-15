import { Repository } from './Repository';
import { Lobby, LobbyStatus } from '../models';
import { knex } from '../db';

export class LobbiesRepository extends Repository<Lobby> {
  getTableName(): string {
    return 'lobbies';
  }
  async create(lobbyId: string, status: LobbyStatus) {
    return knex(this.getTableName())
      .insert({ id: lobbyId, status })
      .returning('*');
  }
}
