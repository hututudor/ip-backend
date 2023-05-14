import { Model } from '../models/Model';
import { knex } from '../db';

export abstract class Repository<T extends Model> {
  abstract getTableName(): string;

  async getAll(): Promise<T[]> {
    return knex(this.getTableName()).select();
  }

  async getById(id: string): Promise<T> {
    const data = await knex(this.getTableName()).where('id', id);
    return data[0];
  }

  async insert(model: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const data = await knex(this.getTableName()).insert(model).returning('*');
    return data[0];
  }

  async update(model: Omit<T, 'createdAt' | 'updatedAt'>): Promise<T> {
    const data = await knex(this.getTableName())
      .update(model)
      .where('id', model.id)
      .returning('*');

    return data[0];
  }

  async deleteById(id: string): Promise<void> {
    await knex(this.getTableName()).delete().where('id', id);
  }
}
