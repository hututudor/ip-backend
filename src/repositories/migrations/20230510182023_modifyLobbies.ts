import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('lobbies', table => {
      table.dropPrimary();
      table.dropColumn('id');
      table.dropColumn('gameEngineID');
      table.dropColumn('userIds');
      table.string('status').notNullable();
    })
    .alterTable('lobbies', table => {
      table.string('id').primary();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('lobbies', table => {
      table.dropPrimary();
      table.dropColumn('id');
      table.string('gameEngineID', 256).notNullable();
      table.specificType('userIds', 'text[]');
      table.dropColumn('status');
    })
    .alterTable('lobbies', table => {
      table.increments('id').primary();
    });
}
