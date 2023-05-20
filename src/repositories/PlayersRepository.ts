import { Player, PlayerStatus } from '../models';
import { Repository } from './Repository';
import { knex } from '../db';

export class PlayersRepository extends Repository<Player> {
  getTableName() {
    return 'players';
  }
  async create(userId: number, lobbyId: string, status: PlayerStatus) {
    return knex(this.getTableName())
      .insert({ userId, lobbyId, status })
      .returning('*');
  }
  async delete(userId: number, lobbyId: string) {
    return knex(this.getTableName()).where({ userId, lobbyId }).delete('*');
  }
  async updatePlayerStatus(
    userId: number,
    lobbyId: string,
    status: PlayerStatus,
  ) {
    return knex(this.getTableName())
      .update('status', status)
      .where({ userId: userId, lobbyId: lobbyId });
  }
  async getPlayerStatus(userId: number) {
    const player = await knex(this.getTableName())
      .select('status')
      .where({ userId })
      .first();

    if (player) {
      return player.status;
    }

    return null;
  }
  async getPlayersInLobby(lobbyId: string): Promise<Player[]> {
    return knex(this.getTableName()).where('lobbyId', lobbyId).select('*');
  }
}
