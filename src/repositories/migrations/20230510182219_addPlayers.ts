import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('players', table => {
    table.integer('userId').references('id').inTable('users');
    table.string('lobbyId').references('id').inTable('lobbies');
    table.string('status').notNullable();
    table.date('createdAt').defaultTo(knex.fn.now());
    table.date('updatedAt').defaultTo(knex.fn.now());

    table.primary(['userId', 'lobbyId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('players');
}
