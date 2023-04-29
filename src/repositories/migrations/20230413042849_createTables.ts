import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('username', 256).notNullable();
      table.string('name', 256).notNullable();
      table.string('password', 256).notNullable();
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('lobbies', table => {
      table.increments('id').primary();
      table.string('gameEngineID', 256).notNullable();
      table.specificType('userIds', 'text[]');
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('wills', table => {
      table.increments('id').primary();
      table.string('data').nullable();
      table.string('userId', 256).notNullable();
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('messages', table => {
      table.increments('id').primary();
      table.string('data').notNullable();
      table.string('userId', 256).notNullable();
      table.string('type', 256).notNullable();
      table.string('lobbyId', 256).notNullable();
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('lobbies')
    .dropTableIfExists('wills')
    .dropTableIfExists('messages');
}
