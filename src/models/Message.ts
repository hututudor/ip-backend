import { Model } from '.';

export interface Message extends Model {
  time: number;
  data: string;
  senderId: string;
  receiverId: string;
  lobbyId: string;
}
