import { Model } from '.';

export interface Will extends Model {
  time: number;
  data: string;
  userId: string;
}
