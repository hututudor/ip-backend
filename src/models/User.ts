import { Model } from './Model';

export interface User extends Model {
  username: string;
  password: string;
  name: string;
}
