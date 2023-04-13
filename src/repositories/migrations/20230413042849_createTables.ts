import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('Users', table => {
      table.increments('id').primary();
      table.string('username', 256).notNullable();
      table.string('name', 256).notNullable();
      table.string('password', 256).notNullable();
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('Lobbies', table => {
      table.increments('id').primary();
      table.string('gameEngineID', 256).notNullable();
      table.specificType('userIDs', 'text[]');
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('Wills', table => {
      table.increments('id').primary();
      table.string('data').nullable();
      table.string('userID', 256).notNullable();
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('Messages', table => {
      table.increments('id').primary();
      table.string('data').notNullable();
      table.string('userID', 256).notNullable();
      table.string('type', 256).notNullable();
      table.string('lobbyID', 256).notNullable();
      table.date('createdAt').defaultTo(knex.fn.now());
      table.date('updatedAt').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('Users')
    .dropTableIfExists('Lobbies')
    .dropTableIfExists('Wills')
    .dropTableIfExists('Messages');
}
