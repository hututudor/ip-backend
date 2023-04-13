import { Model } from '.';

export interface User extends Model {
  username: string;
  password: string;
  name: string;
}
