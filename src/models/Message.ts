import { Model } from '.';

export interface Message extends Model {
  data: string;
  userID: string;
  type: string;
  lobbyID: string;
}
