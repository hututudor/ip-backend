import { Knex } from 'knex';
import { User } from '../../models/User';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name', 256).notNullable();
    table.string('username', 256).notNullable();
    table.string('password', 256).notNullable();
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
