import { Model } from '.';

export interface Lobby extends Model {
  gameEngineID: string;
  userIDs: string[];
}
