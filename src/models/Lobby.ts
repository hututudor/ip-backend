import { Model } from '.';

export type LobbyStatus = 'waiting' | 'started';

export interface Lobby extends Model {
  status: LobbyStatus;
}
