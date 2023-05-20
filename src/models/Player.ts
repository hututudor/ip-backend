import { Model } from '.';

export type PlayerStatus = 'alive' | 'dead';

export interface Player extends Model {
  status: PlayerStatus;
  lobbyId: string;
  userId: string;
}
